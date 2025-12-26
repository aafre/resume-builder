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

  // Helper function to migrate localStorage data to cloud
  const migrateToCloud = async (session: Session, data: any) => {
    try {
      console.log('Migrating localStorage data to cloud...');

      // Prepare icons for upload (convert base64 to proper format if needed)
      const icons = [];
      if (data.iconRegistry) {
        for (const [filename, fileData] of Object.entries(data.iconRegistry)) {
          if (fileData) {
            icons.push({
              filename,
              data: fileData // Assuming it's already in the right format
            });
          }
        }
      }

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: null, // Create new resume
          title: data.contactInfo?.name || 'Untitled Resume',
          template_id: data.templateId || 'modern-with-icons',
          contact_info: data.contactInfo || {},
          sections: data.sections || [],
          icons: icons
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to migrate resume');
      }

      console.log('Migration successful:', result.resume_id);
      toast.success('Your resume has been saved to your account!');

      // Don't clear localStorage - let the editor handle that
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Failed to save your resume to the cloud');
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

          // Only attempt migration if there's a valid old anonymous user ID
          if (oldAnonUserId) {
            // Skip if migration was already attempted (prevents duplicate calls)
            if (migrationAttempted.current) {
              return;
            }

            // Skip if same user (already signed in, just refreshing)
            if (oldAnonUserId === session.user.id) {
              // Clean up - user was already signed in
              localStorage.removeItem('anonymous-user-id');
            } else {
              // Mark migration as attempted before calling API
              migrationAttempted.current = true;

              // Attempt migration and always clean up localStorage after
              await migrateAnonResumes(session, oldAnonUserId);

              // Always remove the anonymous user ID after migration attempt
              // (either it succeeded, or it was stale/invalid)
              localStorage.removeItem('anonymous-user-id');
            }
          }

          // Check if there's unsaved work in localStorage (only if not migrated yet)
          if (!hasMigrated) {
            const unsavedData = checkForUnsavedWork();

            if (unsavedData) {
              // Trigger migration
              const migrated = await migrateToCloud(session, unsavedData);
              if (migrated) {
                setHasMigrated(true);
              }
            }
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
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
