import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Wraps a promise with a timeout. Rejects if promise doesn't resolve within timeoutMs.
 */
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

/**
 * Clears potentially corrupted Supabase auth data from localStorage.
 */
const clearSupabaseAuthStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    const supabaseKeys = keys.filter(key =>
      key.startsWith('sb-') ||
      key.includes('supabase') ||
      key === 'supabase.auth.token'
    );

    supabaseKeys.forEach(key => {
      console.log('Clearing corrupted auth key:', key);
      localStorage.removeItem(key);
    });

    return supabaseKeys.length > 0;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signingOut: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  hasMigrated: boolean;
  migrationInProgress: boolean;
  migratedResumeCount: number;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext for testing purposes
export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [migratedResumeCount, setMigratedResumeCount] = useState(0);
  const migrationAttempted = useRef(false);

  // Track current session in a ref for access in async callbacks
  const sessionRef = useRef<Session | null>(null);

  // Track initialization state in a ref to prevent duplicate init in React Strict Mode
  const isInitializingRef = useRef(false);

  // Track if listener has already handled initialization (to avoid waiting for timeout)
  const listenerHandledInitRef = useRef(false);

  // Update ref whenever session changes
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // TypeScript interfaces for legacy resume migration
  interface LegacyResumeData {
    contactInfo: any;
    sections: any[];
    iconRegistry?: any;
    timestamp: string;
    templateId?: string;
  }

  interface FoundLegacyResume {
    key: string;
    data: LegacyResumeData;
    parsedTimestamp: Date;
  }

  // Helper function to find all legacy localStorage keys from main branch
  // Main branch used pattern: resume-builder-{templateId}-autosave
  const findAllLegacyResumes = (): FoundLegacyResume[] => {
    try {
      const allKeys = Object.keys(localStorage);
      const legacyKeys = allKeys.filter(key =>
        key.match(/^resume-builder-.*-autosave$/)
      );

      console.log('🔍 Found legacy localStorage keys:', legacyKeys);

      const foundResumes: FoundLegacyResume[] = [];

      for (const key of legacyKeys) {
        try {
          const dataStr = localStorage.getItem(key);
          if (!dataStr) continue;

          const parsed: LegacyResumeData = JSON.parse(dataStr);

          // Validate that it has meaningful content
          const hasContactInfo = parsed.contactInfo && Object.keys(parsed.contactInfo)
            .some(k => parsed.contactInfo[k] && String(parsed.contactInfo[k]).trim() !== '');
          const hasSections = parsed.sections && parsed.sections.length > 0;
          const hasIcons = parsed.iconRegistry && Object.keys(parsed.iconRegistry).length > 0;

          if (hasContactInfo || hasSections || hasIcons) {
            foundResumes.push({
              key,
              data: parsed,
              parsedTimestamp: new Date(parsed.timestamp)
            });
          }
        } catch (parseError) {
          console.error(`Failed to parse legacy key ${key}:`, parseError);
          // Skip corrupted entries
        }
      }

      // Sort by timestamp descending (most recent first)
      foundResumes.sort((a, b) =>
        b.parsedTimestamp.getTime() - a.parsedTimestamp.getTime()
      );

      return foundResumes;
    } catch (error) {
      console.error('Error finding legacy resumes:', error);
      return [];
    }
  };

  // Schema validation helper for resume data
  const validateResumeData = (data: any): boolean => {
    try {
      // Validate contactInfo structure
      if (data.contactInfo) {
        const validKeys = ['name', 'email', 'phone', 'location', 'linkedin', 'linkedin_display', 'social_links'];
        const hasValidStructure = Object.keys(data.contactInfo).every(key =>
          validKeys.includes(key)
        );
        if (!hasValidStructure) {
          console.warn('Invalid contactInfo structure');
          return false;
        }
      }

      // Validate sections array
      if (!Array.isArray(data.sections)) {
        console.warn('Sections is not an array');
        return false;
      }

      // Validate each section has required fields
      for (const section of data.sections) {
        if (!section.name || typeof section.name !== 'string') {
          console.warn('Section missing name');
          return false;
        }
        if (!section.content) {
          console.warn('Section missing content');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  // Helper function to migrate multiple legacy resumes to cloud
  const migrateAllLegacyResumes = async (session: Session, legacyResumes: FoundLegacyResume[]) => {
    try {
      console.log(`🚀 Migrating ${legacyResumes.length} legacy resumes to cloud...`);

      const RESUME_LIMIT = 5;
      const resumesToMigrate = legacyResumes.slice(0, RESUME_LIMIT);
      const skippedCount = Math.max(0, legacyResumes.length - RESUME_LIMIT);

      let successCount = 0;
      let failedCount = 0;

      for (const legacyResume of resumesToMigrate) {
        try {
          const { data } = legacyResume;

          // Validate data structure before uploading
          if (!validateResumeData(data)) {
            console.error('Invalid data structure, skipping:', legacyResume.key);
            failedCount++;
            continue;
          }

          // Extract template ID from localStorage key
          // e.g., "resume-builder-modern-with-icons-autosave" → "modern-with-icons"
          const templateMatch = legacyResume.key.match(/^resume-builder-(.*)-autosave$/);
          const templateId = templateMatch ? templateMatch[1] : (data.templateId || 'modern-with-icons');

          // Prepare icons for upload
          const icons = [];
          if (data.iconRegistry?.icons) {
            for (const [filename, iconItem] of Object.entries(data.iconRegistry.icons)) {
              if (iconItem && iconItem.data) {
                icons.push({ filename, data: iconItem.data });
              }
            }
          }

          // Upload to cloud
          const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              id: null, // Create new
              title: data.contactInfo?.name || 'Untitled Resume',
              template_id: templateId,
              contact_info: data.contactInfo || {},
              sections: data.sections || [],
              icons: icons
            })
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to migrate resume');
          }

          console.log('✅ Migrated resume:', result.resume_id, 'from key:', legacyResume.key);
          successCount++;

          // Clean up this specific legacy key after successful migration
          localStorage.removeItem(legacyResume.key);

        } catch (migrateError) {
          console.error('❌ Failed to migrate resume from', legacyResume.key, migrateError);
          failedCount++;
          // Continue with other resumes
        }
      }

      // Show appropriate toast based on results
      if (successCount > 0) {
        if (successCount === 1) {
          toast.success('Your resume has been saved to your account!');
        } else {
          toast.success(`${successCount} resumes have been saved to your account!`);
        }
      }

      if (skippedCount > 0) {
        toast.info(`We migrated your ${RESUME_LIMIT} most recent resumes. ${skippedCount} older drafts were not migrated.`, {
          duration: 7000
        });
      }

      if (failedCount > 0 && successCount === 0) {
        toast.error('Failed to migrate your resumes. Please contact support.');
      }

      return successCount > 0;
    } catch (error) {
      console.error('❌ Migration process failed:', error);
      toast.error('Failed to migrate your resumes. Please try again.');
      return false;
    }
  };

  // Helper function to migrate anonymous user's cloud resumes to authenticated account
  const migrateAnonResumes = async (session: Session, oldUserId: string) => {
    try {
      console.log('Migrating anonymous resumes to authenticated account...');

      const response = await fetch('/api/migrate-anonymous-resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          old_user_id: oldUserId
        })
      });

      if (!response.ok) {
        const result = await response.json();

        // Handle 403 silently - this means the old user ID was not anonymous (stale ID)
        if (response.status === 403) {
          console.log('Skipping migration: old user ID is not anonymous (likely stale)');
          localStorage.removeItem('anonymous-user-id'); // Clean up stale ID
          return false;
        }

        // Show error for other failures (500, network errors, etc.)
        console.error('Failed to migrate anonymous resumes:', result.error);
        toast.error('Failed to migrate your resumes');
        return false;
      }

      const result = await response.json();
      console.log('Resume migration successful:', result);

      // Show success toast with appropriate message
      if (result.migrated_count > 0) {
        if (result.exceeds_limit) {
          toast.success(
            `Your ${result.migrated_count} resume(s) have been migrated. ` +
            `You now have ${result.total_count}/5 resumes - please delete some before creating new ones.`,
            { duration: 7000 }
          );
        } else {
          toast.success(`Your ${result.migrated_count} resume(s) have been migrated successfully!`);
        }
      }

      return true;
    } catch (error) {
      // Catch network errors, JSON parsing errors, etc.
      console.error('Resume migration failed:', error);
      toast.error('Failed to migrate your resumes');
      return false;
    }
  };

  useEffect(() => {
    // If Supabase is not configured, skip auth
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Initialize auth state
    const initializeAuth = async () => {
      // Prevent duplicate initialization (React Strict Mode in dev)
      if (isInitializingRef.current) {
        console.log('Auth already initializing, skipping duplicate call');
        return;
      }
      isInitializingRef.current = true;
      listenerHandledInitRef.current = false; // Reset flag

      const AUTH_TIMEOUT_MS = 10000; // 10 seconds
      let sessionRecovered = false;

      try {
        console.log('Initializing auth...');

        // STEP 1: Try to restore existing session with timeout
        try {
          const { data: { session: existingSession } } = await withTimeout(
            supabase!.auth.getSession(),
            AUTH_TIMEOUT_MS,
            'getSession'
          );

          if (existingSession) {
            // Session exists and is valid
            sessionRecovered = true;
            setSession(existingSession);
            setUser(existingSession.user);
            console.log('✅ Existing session restored:', existingSession.user.id);
            return;
          } else {
            console.log('No existing session found, will create anonymous session');
          }
        } catch (sessionError) {
          // Session recovery failed (timeout, network error, or corrupted data)
          console.error('⚠️ Session recovery failed:', sessionError);

          // IMPORTANT: Check if session was restored by auth listener during the timeout
          // This prevents clearing valid sessions that were restored while we were waiting
          if (sessionRef.current) {
            console.log('✅ Session was restored by auth listener, skipping cleanup');
            sessionRecovered = true;
            return;
          }

          const wasTimeout = sessionError instanceof Error && sessionError.message.includes('timed out');

          if (wasTimeout) {
            console.log('Session recovery timed out - likely corrupted localStorage');
            toast.error('Authentication timed out. Starting fresh session...', { duration: 5000 });
          }

          // Clear potentially corrupted auth data
          const clearedKeys = clearSupabaseAuthStorage();
          if (clearedKeys) {
            console.log('Cleared corrupted auth storage');
          }
        }

        // STEP 2: Create fresh anonymous session (fallback)
        // Only if listener didn't already handle initialization
        if (!listenerHandledInitRef.current && !sessionRef.current) {
          console.log('Creating fresh anonymous session...');

          // Use non-blocking pattern (like signOut fix) - don't await
          // Let auth state listener handle the session update
          supabase!.auth.signInAnonymously().then(({ data, error }) => {
            if (error) {
              console.error('❌ Anonymous sign-in error:', error);
              toast.error('Failed to create session. Please refresh the page.');
            } else if (data.session && data.user) {
              console.log('✅ Anonymous session created:', data.user.id);
            }
          }).catch((error) => {
            console.error('❌ Anonymous sign-in failed:', error);
            toast.error('Failed to create session. Please refresh the page.');
          });

          // Small delay to let anonymous sign-in start processing
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          console.log('Skipping anonymous session creation - listener already handled init');
        }

      } catch (error) {
        // Catch-all for unexpected errors
        console.error('❌ Unexpected auth initialization error:', error);

        if (!sessionRecovered) {
          toast.error('Authentication failed. Please refresh the page.');
        }
      } finally {
        // Only set loading to false if listener hasn't already done it
        if (!listenerHandledInitRef.current) {
          setLoading(false);
        }
        isInitializingRef.current = false;
        console.log('Auth initialization complete (UI ready)');
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);

        // If we're still initializing and listener got a valid session,
        // immediately unblock the UI - don't wait for getSession() timeout
        if (isInitializingRef.current && session) {
          console.log('🚀 Listener restored session during init, unblocking UI immediately');
          listenerHandledInitRef.current = true;
          setLoading(false);
        }

        // Store anonymous user_id for migration later
        if (session?.user?.is_anonymous) {
          localStorage.setItem('anonymous-user-id', session.user.id);
        }

        // IMPORTANT: Migrate localStorage data for BOTH anonymous and authenticated users
        // This handles the upgrade scenario where old app (main branch) used localStorage
        if (session && !hasMigrated && !migrationAttempted.current) {
          migrationAttempted.current = true;

          const legacyResumes = findAllLegacyResumes();

          if (legacyResumes.length > 0) {
            console.log(`📦 Found ${legacyResumes.length} legacy resumes to migrate`);

            // Show migration UI
            setMigrationInProgress(true);

            const migrated = await migrateAllLegacyResumes(session, legacyResumes);
            if (migrated) {
              setHasMigrated(true);
              setMigratedResumeCount(legacyResumes.length);
              setMigrationInProgress(false);

              // Redirect to my-resumes after short delay to show success toast
              setTimeout(() => {
                window.location.href = '/my-resumes';
              }, 1500);
            } else {
              setMigrationInProgress(false);
            }
          }
        }

        // Trigger migration when user signs in (from anonymous to authenticated)
        if (event === 'SIGNED_IN' && session?.user && !session.user.is_anonymous) {
          // Show welcome toast on successful sign-in (only once per session)
          const hasShownToast = sessionStorage.getItem('login-toast-shown');
          if (!hasShownToast) {
            toast.success('Signed in successfully');
            sessionStorage.setItem('login-toast-shown', 'true');
          }

          // Refresh user metadata to ensure avatar_url is populated from OAuth provider
          try {
            const { data: { user: refreshedUser }, error } = await supabase!.auth.getUser();
            if (!error && refreshedUser) {
              setUser(refreshedUser);
              console.log('User metadata refreshed after OAuth sign-in');
            }
          } catch (error) {
            console.error('Failed to refresh user metadata:', error);
            // Non-critical error - continue with existing metadata
          }

          // Migrate anonymous user's cloud resumes to authenticated account
          const oldAnonUserId = localStorage.getItem('anonymous-user-id');

          if (oldAnonUserId && oldAnonUserId !== session.user.id) {
            console.log('👤 Migrating anonymous cloud resumes to authenticated account...');

            await migrateAnonResumes(session, oldAnonUserId);
            localStorage.removeItem('anonymous-user-id');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href, // Stay on current page
      },
    });

    if (error) throw error;
  };

  const signInWithLinkedIn = async () => {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: window.location.href, // Stay on current page
      },
    });

    if (error) throw error;
  };

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error('Supabase not configured');

    console.log('🔵 Attempting to send magic link to:', email);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href, // Stay on current page
      },
    });

    console.log('🔵 Magic link response:', { data, error });

    if (error) {
      console.error('❌ Magic link error:', error);
      throw error;
    }

    console.log('✅ Magic link sent successfully');
  };

  const signOut = async () => {
    if (!supabase || signingOut) return; // Prevent double-clicks

    try {
      setSigningOut(true);

      // Reset toast flag and migration state
      sessionStorage.removeItem('login-toast-shown');
      localStorage.removeItem('anonymous-user-id');
      migrationAttempted.current = false;

      // Show success toast
      toast.success('Signed out successfully');

      // Sign out current user (don't await - can hang in some Supabase versions)
      // The auth state listener will handle state updates
      supabase.auth.signOut().catch((error) => {
        console.error('Sign out error:', error);
      });

      // Small delay to let sign out process
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create new anonymous session
      const { error: anonError } = await supabase.auth.signInAnonymously();

      if (anonError) {
        console.error('Error creating new anonymous session:', anonError);
        toast.error('Failed to create new session. Please refresh the page.');
      } else {
        console.log('New anonymous session created after sign-out');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error('Sign out failed. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  // Compute derived auth state
  const isAnonymous = user?.is_anonymous ?? false;
  const isAuthenticated = !!user && !isAnonymous;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signingOut,
    isAuthenticated,
    isAnonymous,
    hasMigrated,
    migrationInProgress,
    migratedResumeCount,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
