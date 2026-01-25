/**
 * useResumeCreate Hook
 *
 * Provides shared resume creation logic used by TemplateCarousel, JobExamplePage,
 * and other components that create new resumes.
 *
 * Handles:
 * - Creating empty resumes or resumes with example data via /api/resumes/create
 * - Importing resumes with custom data (AI import, job examples) via /api/resumes
 * - 5-resume limit enforcement with user-friendly error handling
 * - Cache invalidation and navigation
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  linkedin_display?: string;
  social_links?: Array<{ platform: string; url: string; display: string }>;
}

interface Section {
  id?: string;
  name?: string;
  type?: string;
  title?: string;
  content: any;
}

interface IconData {
  filename: string;
  data: string;
}

export interface CreateResumeOptions {
  /** Template ID to use for the resume */
  templateId: string;
  /** Custom title for the resume (optional) */
  title?: string;
  /** Load example data from template (for /api/resumes/create) */
  loadExample?: boolean;
  /** Contact info for import (for /api/resumes) */
  contactInfo?: ContactInfo;
  /** Sections for import (for /api/resumes) */
  sections?: Section[];
  /** Icons for import (for /api/resumes) */
  icons?: IconData[];
  /** AI import confidence score (optional) */
  aiImportConfidence?: number;
  /** AI import warnings (optional) */
  aiImportWarnings?: string[];
}

export interface UseResumeCreateReturn {
  /** Create a new resume and navigate to the editor */
  createResume: (options: CreateResumeOptions) => Promise<string | null>;
  /** Whether a resume is currently being created */
  creating: boolean;
}

/**
 * Hook for creating resumes with consistent error handling and navigation
 */
export function useResumeCreate(): UseResumeCreateReturn {
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const createResume = useCallback(async (options: CreateResumeOptions): Promise<string | null> => {
    if (!session) {
      toast.error("Session not ready. Please try again.");
      return null;
    }

    if (creating) {
      // Prevent double-clicks
      return null;
    }

    setCreating(true);

    try {
      let response;

      if (options.contactInfo && options.sections) {
        // Import with data (like AI import or job example)
        response = await apiClient.post("/api/resumes", {
          id: null, // Create new resume
          title: options.title || 'Resume',
          template_id: options.templateId,
          contact_info: options.contactInfo,
          sections: options.sections,
          icons: options.icons || [],
          ai_import_confidence: options.aiImportConfidence,
          ai_import_warnings: options.aiImportWarnings,
        }, { session });
      } else {
        // Standard create (empty or example)
        response = await apiClient.post("/api/resumes/create", {
          template_id: options.templateId,
          load_example: options.loadExample ?? false,
        }, { session });
      }

      // Invalidate caches to ensure fresh data when user returns to /my-resumes
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['resumes'] }),
        queryClient.invalidateQueries({ queryKey: ['resume-count'] }),
      ]);

      toast.success("Resume created! Loading editor...");
      navigate(`/editor/${response.resume_id}`);
      return response.resume_id;

    } catch (error: any) {
      if (error.data?.error_code === "RESUME_LIMIT_REACHED") {
        toast.error("Resume limit reached (5/5). Delete a resume to create a new one.");
        navigate("/my-resumes");
        return null;
      }
      console.error("Error creating resume:", error);
      toast.error("Failed to create resume. Please try again.");
      return null;
    } finally {
      setCreating(false);
    }
  }, [session, navigate, queryClient, creating]);

  return { createResume, creating };
}
