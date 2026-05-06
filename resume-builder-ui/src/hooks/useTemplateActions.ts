/**
 * useTemplateActions Hook
 *
 * Encapsulates all modal, auth, and recovery logic for template interactions.
 * Extracted from TemplateCarousel to enable reuse in UnifiedTemplateSection
 * while keeping TemplateCarousel unchanged for other pages.
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api-client';
import { useAuth } from '../contexts/AuthContext';
import { useResumeCreate } from './useResumeCreate';
import toast from 'react-hot-toast';
import yaml from 'js-yaml';

interface Template {
  id: string;
  name: string;
  description: string;
  image_url: string;
  tags?: string[];
  supports_icons?: boolean;
}

export function useTemplateActions(templates: Template[], filteredTemplates: Template[]) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<string | null>(null);
  const [checkingExistingResume, setCheckingExistingResume] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplateIndex, setPreviewTemplateIndex] = useState(0);
  const [existingResumeId, setExistingResumeId] = useState<string | null>(null);
  const [existingResumeTitle, setExistingResumeTitle] = useState<string>('');
  const [processingRecoveryRedirect, setProcessingRecoveryRedirect] = useState(false);

  const navigate = useNavigate();
  const { session, isAnonymous, isAuthenticated, anonMigrationInProgress } = useAuth();
  const { createResume, creating } = useResumeCreate();

  // Select the first template once loaded
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  const handleSelectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const handlePreview = useCallback((template: Template) => {
    const index = filteredTemplates.findIndex(t => t.id === template.id);
    setPreviewTemplateIndex(index >= 0 ? index : 0);
    setShowPreviewModal(true);
  }, [filteredTemplates]);

  const handleUseTemplate = useCallback(async (templateId: string) => {
    if (!session) {
      toast.error("Please sign in to create a resume");
      return;
    }

    try {
      setCheckingExistingResume(true);

      const data = await apiClient.get('/api/resumes?limit=50', { session });
      const resumes = data.resumes || [];

      const matchingResumes = resumes.filter(
        (resume: any) => resume.template_id === templateId
      );

      if (matchingResumes.length > 0) {
        const mostRecent = matchingResumes.sort(
          (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];

        setExistingResumeId(mostRecent.id);
        setExistingResumeTitle(mostRecent.title);
        setSelectedTemplateForModal(templateId);
        setShowPreviewModal(false);
        setShowRecoveryModal(true);
      } else {
        setSelectedTemplateForModal(templateId);
        setShowPreviewModal(false);
        setShowStartModal(true);
      }
    } catch (error) {
      console.error('Error checking existing resumes:', error);
      setSelectedTemplateForModal(templateId);
      setShowPreviewModal(false);
      setShowStartModal(true);
    } finally {
      setCheckingExistingResume(false);
    }
  }, [session]);

  const handleModalSelectEmpty = useCallback(async () => {
    if (!selectedTemplateForModal) return;
    setShowStartModal(false);
    await createResume({
      templateId: selectedTemplateForModal,
      loadExample: false,
    });
  }, [selectedTemplateForModal, createResume]);

  const handleModalSelectExample = useCallback(async () => {
    if (!selectedTemplateForModal) return;
    setShowStartModal(false);
    await createResume({
      templateId: selectedTemplateForModal,
      loadExample: true,
    });
  }, [selectedTemplateForModal, createResume]);

  const handleContinueAsGuest = useCallback(() => {
    setShowRecoveryModal(false);
    if (existingResumeId) {
      navigate(`/editor/${existingResumeId}`);
    }
  }, [existingResumeId, navigate]);

  const handleSignInToContinue = useCallback(() => {
    if (existingResumeId) {
      localStorage.setItem('resume-recovery-intent', JSON.stringify({
        resumeId: existingResumeId,
        action: 'continue',
        timestamp: Date.now()
      }));
    }
    setShowRecoveryModal(false);
    setShowAuthModal(true);
  }, [existingResumeId]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleCreateNewFromRecovery = useCallback(() => {
    setShowRecoveryModal(false);
    setShowStartModal(true);
  }, []);

  const handleModalSelectImport = useCallback(async (yamlString: string, confidence: number, warnings: string[]) => {
    setShowStartModal(false);

    const parsedYaml = yaml.load(yamlString) as {
      contact_info: any;
      sections: any[];
      __icons__?: Record<string, string>;
    };

    const iconsArray: { filename: string; data: string }[] = [];
    if (parsedYaml.__icons__) {
      for (const [filename, data] of Object.entries(parsedYaml.__icons__)) {
        iconsArray.push({ filename, data });
      }
    }

    const generateTitle = (): string => {
      const experienceSection = parsedYaml.sections.find(
        s => s.type === 'experience'
      );
      if (experienceSection && Array.isArray(experienceSection.content) &&
          experienceSection.content.length > 0) {
        const firstJob = experienceSection.content[0];
        if (typeof firstJob === 'object' && firstJob !== null && 'title' in firstJob && firstJob.title) {
          return firstJob.title;
        }
      }

      if (parsedYaml.contact_info?.name) {
        const templateName = (selectedTemplateForModal || 'modern')
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return `${parsedYaml.contact_info.name} - ${templateName}`;
      }

      return 'Imported Resume';
    };

    await createResume({
      templateId: selectedTemplateForModal || 'modern',
      title: generateTitle(),
      contactInfo: parsedYaml.contact_info,
      sections: parsedYaml.sections,
      icons: iconsArray,
      aiImportConfidence: confidence,
      aiImportWarnings: warnings,
    });
  }, [selectedTemplateForModal, createResume]);

  // Check for recovery intent on mount
  useEffect(() => {
    const recoveryIntent = localStorage.getItem('resume-recovery-intent');
    if (recoveryIntent) {
      try {
        const { timestamp } = JSON.parse(recoveryIntent);
        const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

        if (isRecent && (isAuthenticated || anonMigrationInProgress)) {
          setProcessingRecoveryRedirect(true);
        }
      } catch (error) {
        console.error('Failed to parse recovery intent:', error);
      }
    }
  }, [isAuthenticated, anonMigrationInProgress]);

  // Handle post-auth navigation
  useEffect(() => {
    if (isAuthenticated && !isAnonymous && !anonMigrationInProgress) {
      const recoveryIntent = localStorage.getItem('resume-recovery-intent');
      if (recoveryIntent) {
        try {
          const { resumeId, action, timestamp } = JSON.parse(recoveryIntent);
          const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

          if (action === 'continue' && resumeId && isRecent) {
            localStorage.removeItem('resume-recovery-intent');
            setProcessingRecoveryRedirect(true);
            navigate(`/editor/${resumeId}`);
          } else {
            setProcessingRecoveryRedirect(false);
          }
        } catch (error) {
          console.error('Failed to parse recovery intent:', error);
          setProcessingRecoveryRedirect(false);
        }
      } else {
        setProcessingRecoveryRedirect(false);
      }
    }
  }, [isAuthenticated, isAnonymous, anonMigrationInProgress, navigate]);

  const selectedTemplateModalName = selectedTemplateForModal
    ? templates.find(t => t.id === selectedTemplateForModal)?.name || ''
    : '';

  return {
    // State
    selectedTemplate,
    selectedTemplateForModal,
    checkingExistingResume,
    creating,
    showStartModal,
    showRecoveryModal,
    showAuthModal,
    showPreviewModal,
    previewTemplateIndex,
    existingResumeId,
    existingResumeTitle,
    processingRecoveryRedirect,
    isAnonymous,
    anonMigrationInProgress,
    selectedTemplateModalName,

    // Handlers
    handleSelectTemplate,
    handlePreview,
    handleUseTemplate,
    handleModalSelectEmpty,
    handleModalSelectExample,
    handleModalSelectImport,
    handleContinueAsGuest,
    handleSignInToContinue,
    handleAuthSuccess,
    handleCreateNewFromRecovery,

    // Setters (for modal close)
    setShowStartModal,
    setShowRecoveryModal,
    setShowAuthModal,
    setShowPreviewModal,
  };
}
