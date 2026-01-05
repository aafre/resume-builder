// src/hooks/editor/useEditorState.ts

import { useState, useCallback, useMemo } from 'react';
import type { ContactInfo, Section } from '../../types';

/**
 * Interface defining the return value of useEditorState hook.
 * Manages core editor state including contact info, sections, template metadata, and loading states.
 */
export interface UseEditorStateReturn {
  // Core resume data
  contactInfo: ContactInfo | null;
  sections: Section[];
  templateId: string | null;

  // Template metadata
  supportsIcons: boolean;
  originalTemplateData: {
    contactInfo: ContactInfo;
    sections: Section[];
  } | null;

  // Loading states
  loading: boolean;
  loadingError: string | null;

  // Setters
  setContactInfo: (contactInfo: ContactInfo | null) => void;
  setSections: (sections: Section[]) => void;
  setTemplateId: (templateId: string | null) => void;
  setSupportsIcons: (supportsIcons: boolean) => void;
  setOriginalTemplateData: (data: { contactInfo: ContactInfo; sections: Section[] } | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingError: (error: string | null) => void;

  // Helper functions
  updateSection: (index: number, updatedSection: Section) => void;
}

/**
 * Custom hook for managing core editor state.
 *
 * Extracted from Editor.tsx to improve component organization and testability.
 * Manages resume data (contact info, sections), template metadata, and loading states.
 *
 * @returns {UseEditorStateReturn} Object containing all state values, setters, and helper functions
 */
export const useEditorState = (): UseEditorStateReturn => {
  // Core resume data state
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);

  // Template metadata state
  const [supportsIcons, setSupportsIcons] = useState(false);
  const [originalTemplateData, setOriginalTemplateData] = useState<{
    contactInfo: ContactInfo;
    sections: Section[];
  } | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  /**
   * Updates a specific section at the given index.
   * Creates a new array with the updated section to maintain immutability.
   *
   * @param {number} index - The index of the section to update
   * @param {Section} updatedSection - The new section data
   */
  const updateSection = useCallback(
    (index: number, updatedSection: Section) => {
      const updatedSections = [...sections];
      updatedSections[index] = updatedSection;
      setSections(updatedSections);
    },
    [sections]
  );

  // Return stable object with useMemo to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Core resume data
      contactInfo,
      sections,
      templateId,

      // Template metadata
      supportsIcons,
      originalTemplateData,

      // Loading states
      loading,
      loadingError,

      // Setters
      setContactInfo,
      setSections,
      setTemplateId,
      setSupportsIcons,
      setOriginalTemplateData,
      setLoading,
      setLoadingError,

      // Helper functions
      updateSection,
    }),
    [
      contactInfo,
      sections,
      templateId,
      supportsIcons,
      originalTemplateData,
      loading,
      loadingError,
      updateSection,
    ]
  );
};
