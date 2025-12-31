import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase credentials not configured. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : null;

// Type definitions for database tables
export type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  contact_info: any;
  sections: any[];
  pdf_url: string | null;
  pdf_generated_at: string | null;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  deleted_at: string | null;
};

export type ResumeIconRow = {
  id: string;
  resume_id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  storage_url: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

export type UserPreferencesRow = {
  user_id: string;
  last_edited_resume_id: string | null;
  tour_completed: boolean;
  idle_nudge_shown: boolean;
  preferences: Record<string, any>; // JSONB for future extensibility
  created_at: string;
  updated_at: string;
};
