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

import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { toastFailure } from '../utils/toasts';
import { trackResumeCreated } from '../lib/analytics';

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
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
  // Synchronous in-flight guard: `creating` state is stale inside calls made
  // before React re-renders (e.g. a timer-driven import racing a manual click),
  // so it cannot block a second concurrent create.
  const inFlight = useRef(false);

  const createResume = useCallback(async (options: CreateResumeOptions): Promise<string | null> => {
    if (!session) {
      toast.error("Still getting ready. Try again in a moment.");
      return null;
    }

    if (inFlight.current) {
      // Prevent double-clicks and concurrent creates
      return null;
    }

    inFlight.current = true;
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

      // Mirrors the create/import branch above so the method reflects the real path taken
      const method = options.contactInfo && options.sections
        ? (options.aiImportConfidence != null ? 'ai_import' : 'job_example')
        : (options.loadExample ? 'example' : 'blank');
      trackResumeCreated({ template_id: options.templateId, method });

      navigate(`/editor/${response.resume_id}`);
      return response.resume_id;

    } catch (error: any) {
      if (error.data?.error_code === "RESUME_LIMIT_REACHED") {
        toast.error("You're at the 5-resume limit. Delete one to create a new resume.");
        navigate("/my-resumes");
        return null;
      }
      console.error("Error creating resume:", error);
      toastFailure("create your resume", error);
      return null;
    } finally {
      inFlight.current = false;
      setCreating(false);
    }
  }, [session, navigate, queryClient]);

  return { createResume, creating };
}
