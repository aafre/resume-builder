// src/hooks/editor/useResumeLoader.ts
// Resume loader hook (Layer 3) - manages loading resumes from cloud and templates

import { useState, useEffect, useCallback, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import yaml from 'js-yaml';
import { ContactInfo, Section } from '../../types';
import { UseResumeLoaderReturn } from '../../types/editor';
import { UseIconRegistryReturn } from '../useIconRegistry';
import { fetchTemplate } from '../../services/templates';
import { migrateLegacySections } from '../../utils/sectionMigration';
import { ensureSectionIds } from '../../services/sectionService';
import { processSectionsForExport } from '../../services/yamlService';
import { validateYAMLStructure, validateResumeStructure } from '../../services/validationService';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';

/**
 * Props for useResumeLoader hook (dependency injection from Layer 1/2)
 */
export interface UseResumeLoaderProps {
  // Editor state dependencies
  contactInfo: ContactInfo | null;
  sections: Section[];
  setContactInfo: (info: ContactInfo | null) => void;
  setSections: (sections: Section[]) => void;
  templateId: string | null;
  setTemplateId: (id: string | null) => void;
  setSupportsIcons: (supports: boolean) => void;
  setOriginalTemplateData: (data: { contactInfo: ContactInfo; sections: Section[] } | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingError: (error: string | null) => void;

  // Auth dependencies
  authLoading: boolean;
  anonMigrationInProgress: boolean;
  session: Session | null;

  // Icon registry
  iconRegistry: UseIconRegistryReturn;

  // URL params
  resumeIdFromUrl: string | undefined;
  searchParams: URLSearchParams;

  // AI warning state setters
  setShowAIWarning: (show: boolean) => void;
  setAIWarnings: (warnings: string[]) => void;
  setAIConfidence: (confidence: number) => void;

  // Tour state
  isSigningInFromTour: boolean;
}

/**
 * useResumeLoader Hook
 *
 * Manages loading resumes from cloud storage and templates including:
 * - Template loading when no resumeId in URL
 * - Cloud resume loading when resumeId present in URL
 * - Icon restoration from storage URLs
 * - AI warning state population
 * - Duplicate load prevention
 *
 * @param props - Dependency injection props from useEditorState and other hooks
 * @returns Resume loader state and methods
 *
 * @example
 * const loader = useResumeLoader({
 *   contactInfo,
 *   sections,
 *   setContactInfo,
 *   setSections,
 *   templateId,
 *   setTemplateId,
 *   authLoading,
 *   session,
 *   iconRegistry,
 *   resumeIdFromUrl,
 *   ...
 * });
 *
 * // State is managed automatically via useEffect
 * console.log(loader.isLoadingFromUrl);
 * console.log(loader.cloudResumeId);
 */
export const useResumeLoader = ({
  contactInfo,
  sections,
  setContactInfo,
  setSections,
  templateId,
  setTemplateId,
  setSupportsIcons,
  setOriginalTemplateData,
  setLoading,
  setLoadingError,
  authLoading,
  anonMigrationInProgress,
  session,
  iconRegistry,
  resumeIdFromUrl,
  searchParams,
  setShowAIWarning,
  setAIWarnings,
  setAIConfidence,
  isSigningInFromTour,
}: UseResumeLoaderProps): UseResumeLoaderReturn => {
  // Track loading state
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState<boolean>(!!resumeIdFromUrl);
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState<boolean>(false);
  const [cloudResumeId, setCloudResumeId] = useState<string | null>(resumeIdFromUrl || null);

  // Ref to prevent concurrent cloud load calls (guards against re-renders during async operation)
  const isLoadingCloudResumeRef = useRef<boolean>(false);

  /**
   * Load template data from API
   * Called automatically when templateId is set or can be called imperatively
   */
  const loadTemplate = useCallback(
    async (templateIdToLoad: string) => {
      try {
        setLoading(true);
        const { yaml: yamlString, supportsIcons } = await fetchTemplate(templateIdToLoad);

        // Parse YAML content
        const parsedData = yaml.load(yamlString);

        // Validate structure before type assertion
        const validation = validateYAMLStructure(parsedData);
        if (!validation.valid) {
          throw new Error(`Invalid template structure: ${validation.error}`);
        }

        // Safe to assert type after validation
        const parsedYaml = parsedData as {
          contact_info: ContactInfo;
          sections: Section[];
        };

        setContactInfo(parsedYaml.contact_info);

        // Migrate legacy sections (auto-add type property for backwards compatibility)
        const migratedSections = migrateLegacySections(parsedYaml.sections);

        // Ensure all sections have stable IDs
        const sectionsWithIds = ensureSectionIds(migratedSections);

        // Process sections to clean up icon paths when loading template
        const processedSections = processSectionsForExport(sectionsWithIds);
        setSections(processedSections);
        setSupportsIcons(supportsIcons);

        // Store original template data to compare against changes
        setOriginalTemplateData({
          contactInfo: parsedYaml.contact_info,
          sections: processedSections,
        });
      } catch (error) {
        console.error(`Error fetching template '${templateIdToLoad}':`, error);
        setLoadingError(
          'Failed to load template. Please check your connection and try again.'
        );
        // Don't show toast when we're going to show error page
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setContactInfo, setSections, setSupportsIcons, setOriginalTemplateData, setLoadingError]
  );

  /**
   * Load resume from cloud storage by ID
   * Called automatically when resumeIdFromUrl is present or can be called imperatively
   */
  const loadResumeFromCloud = useCallback(
    async (resumeId: string) => {
      // Prevent concurrent loads (guards against re-renders during async operation)
      if (isLoadingCloudResumeRef.current) {
        return;
      }
      isLoadingCloudResumeRef.current = true;

      try {
        setLoading(true);

        // Use session from AuthContext instead of calling getSession()
        if (!session) {
          toast.error('Please sign in to load saved resumes');
          return;
        }

        // Use centralized API client (handles auth, 401/403 interceptor)
        const apiResponse = await apiClient.get(`/api/resumes/${resumeId}`);

        // Validate resume data structure before using it
        const validation = validateResumeStructure(apiResponse.resume);
        if (!validation.valid) {
          throw new Error(`Invalid resume data from API: ${validation.error}`);
        }

        // Safe to use resume data after validation
        const { resume } = apiResponse;

        // Populate editor state from database (JSONB)
        setContactInfo(resume.contact_info);

        // Ensure all sections have stable IDs (legacy data might not)
        const sectionsWithIds = ensureSectionIds(resume.sections);
        setSections(sectionsWithIds);

        setTemplateId(resume.template_id); // Get template ID from database
        setCloudResumeId(resume.id);

        // Load template structure and metadata (including supportsIcons flag)
        try {
          const { yaml: templateYaml, supportsIcons } = await fetchTemplate(resume.template_id);

          // Use authoritative supportsIcons flag from backend
          setSupportsIcons(supportsIcons);

          // Parse YAML content
          const parsedData = yaml.load(templateYaml);

          // Validate structure before type assertion
          const validation = validateYAMLStructure(parsedData);
          if (!validation.valid) {
            throw new Error(`Invalid template structure: ${validation.error}`);
          }

          // Safe to assert type after validation
          const templateData = parsedData as {
            contact_info: ContactInfo;
            sections: Section[];
          };

          // Migrate and process template sections
          const migratedTemplateSections = migrateLegacySections(templateData.sections);
          const processedTemplateSections = processSectionsForExport(migratedTemplateSections);

          setOriginalTemplateData({
            contactInfo: templateData.contact_info,
            sections: processedTemplateSections,
          });
        } catch (templateError) {
          console.error(`Failed to load template structure for '${resume.template_id}':`, templateError);
          // Fallback: use hardcoded check only if template fetch fails
          const fallbackSupportsIcons = resume.template_id === 'modern-with-icons';
          setSupportsIcons(fallbackSupportsIcons);
          // Non-critical: Start Fresh will still fail gracefully if originalTemplateData is null
        }

        // Load icons from storage URLs and register them
        iconRegistry.clearRegistry(); // Clear existing icons first
        for (const icon of resume.icons || []) {
          try {
            const iconResponse = await fetch(icon.storage_url);
            const blob = await iconResponse.blob();
            const file = new File([blob], icon.filename, { type: blob.type });
            // Use registerIconWithFilename to preserve original filename from storage
            iconRegistry.registerIconWithFilename(file, icon.filename);
          } catch (iconError) {
            console.error(`Failed to load icon ${icon.filename}:`, iconError);
          }
        }

        // Check if resume has AI import metadata and show warning banner
        if (resume.ai_import_warnings || resume.ai_import_confidence) {
          setShowAIWarning(true);
          setAIWarnings(resume.ai_import_warnings || []);
          setAIConfidence(resume.ai_import_confidence || 0);
        }

        // Only show toast if NOT loading after migration from tour sign-in
        if (!isSigningInFromTour) {
          toast.success('Resume loaded successfully');
        }

        setIsLoadingFromUrl(false);
        setHasLoadedFromUrl(true); // Mark as loaded to prevent re-runs
      } catch (error) {
        console.error(`Failed to load resume '${resumeId}':`, error);

        // Check if we can recover from template or have fallback data
        // This happens when:
        // 1. User logs in via OAuth, redirects back to /editor/{oldResumeId}
        // 2. Old resume ID doesn't exist in database (auto-save hadn't triggered yet)
        // 3. But Editor can recover by loading template data
        const hasTemplateParam = searchParams.get('template');
        const hasEditorState = contactInfo && sections.length > 0;
        const canRecover = templateId || hasTemplateParam || hasEditorState;

        if (!canRecover) {
          // Only show toast if we can't recover - this is a true error
          toast.error(error instanceof Error ? error.message : 'Failed to load resume');
        } else {
          console.log('Resume not found in database, will recover from template or existing editor state');
        }

        setIsLoadingFromUrl(false);
        // Don't set hasLoadedFromUrl on error - allow retry after migration completes
      } finally {
        setLoading(false);
        isLoadingCloudResumeRef.current = false;
      }
    },
    [
      setLoading,
      session,
      setContactInfo,
      setSections,
      setTemplateId,
      setSupportsIcons,
      setOriginalTemplateData,
      iconRegistry,
      setShowAIWarning,
      setAIWarnings,
      setAIConfidence,
      isSigningInFromTour,
      searchParams,
      contactInfo,
      sections,
      templateId,
    ]
  );

  // Load template when templateId is set (effect)
  useEffect(() => {
    // Skip template loading if we're loading a saved resume from URL
    // The resume data will be loaded from the database instead
    if (resumeIdFromUrl || isLoadingFromUrl) {
      return;
    }

    // Skip if no template ID is set yet
    if (!templateId) {
      return;
    }

    // Skip template loading if editor already has data (e.g., from YAML import)
    // This prevents overwriting imported data with default template
    if (contactInfo && sections.length > 0) {
      return;
    }

    loadTemplate(templateId);
  }, [templateId, resumeIdFromUrl, isLoadingFromUrl, contactInfo, sections.length, loadTemplate]);

  // Load saved resume from cloud when resumeId is in URL (effect)
  useEffect(() => {
    // Wait for auth to be ready AND migration to complete
    if (authLoading || anonMigrationInProgress) return;

    if (!resumeIdFromUrl || !supabase) return;

    // Prevent loading multiple times
    if (hasLoadedFromUrl) return;

    loadResumeFromCloud(resumeIdFromUrl);
  }, [resumeIdFromUrl, authLoading, anonMigrationInProgress, hasLoadedFromUrl, loadResumeFromCloud]);

  return {
    isLoadingFromUrl,
    setIsLoadingFromUrl,
    hasLoadedFromUrl,
    cloudResumeId,
    setCloudResumeId,
    loadResumeFromCloud,
    loadTemplate,
  };
};
