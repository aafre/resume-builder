import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { apiClient, ApiError } from '../lib/api-client';
import { toast } from 'react-hot-toast';
import type { User, Session } from '@supabase/supabase-js';


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signingOut: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  hasMigrated: boolean;
  migrationInProgress: boolean;
  anonMigrationInProgress: boolean;
  migratedResumeCount: number;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  authModalOpen: boolean;
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
  const [anonMigrationInProgress, setAnonMigrationInProgress] = useState(false);
  const [migratedResumeCount, setMigratedResumeCount] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const migrationAttempted = useRef(false);
  const anonMigrationAttempted = useRef(false);

  // Track current session in a ref for access in async callbacks
  const sessionRef = useRef<Session | null>(null);

  // Wrapper to update both ref and state synchronously to prevent race conditions
  // This ensures sessionRef.current is updated BEFORE the state setter triggers re-renders
  const setSessionAndRef = useCallback((newSession: Session | null) => {
    sessionRef.current = newSession;  // Update ref first (synchronous)
    setSession(newSession);            // Then update state (triggers re-render)
  }, []);

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
              if (iconItem && typeof iconItem === 'object' && 'data' in iconItem) {
                icons.push({ filename, data: (iconItem as any).data });
              }
            }
          }

          // Upload to cloud using apiClient (handles token refresh automatically)
          const result = await apiClient.post('/api/resumes', {
            id: null, // Create new
            title: data.contactInfo?.name || 'Untitled Resume',
            template_id: templateId,
            contact_info: data.contactInfo || {},
            sections: data.sections || [],
            icons: icons
          }, { session });

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
        toast(`We migrated your ${RESUME_LIMIT} most recent resumes. ${skippedCount} older drafts were not migrated.`, {
          duration: 7000,
          icon: 'ℹ️'
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

      // Use apiClient for automatic token refresh
      const result = await apiClient.post('/api/migrate-anonymous-resumes', {
        old_user_id: oldUserId
      }, { session });

      console.log('Resume migration successful:', result);

      // Show toast only for important warnings (exceeds limit)
      if (result.migrated_count > 0) {
        if (result.exceeds_limit) {
          toast.success(
            `Your ${result.migrated_count} resume(s) have been migrated. ` +
            `You now have ${result.total_count}/5 resumes - please delete some before creating new ones.`,
            { duration: 7000 }
          );
        } else {
          // Silent success - tour toast will handle confirmation
          console.log(`✅ ${result.migrated_count} resume(s) migrated successfully`);
        }
      }

      return true;
    } catch (error) {
      // apiClient can throw ApiError which has a status property

      // Handle 403 silently - this means the old user ID was not anonymous (stale ID)
      if (error instanceof ApiError && error.status === 403) {
        console.log('Skipping migration: old user ID is not anonymous (likely stale)');
        localStorage.removeItem('anonymous-user-id'); // Clean up stale ID
        return false;
      }

      // Show error for other failures (500, network errors, token refresh failures)
      const message = error instanceof Error ? error.message : String(error);
      console.error('Failed to migrate anonymous resumes:', message);
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

    // Listen for auth state changes - Supabase handles everything
    // This is the ONLY initialization logic - no separate initializeAuth function
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth event:', event, session?.user?.is_anonymous ? 'anonymous' : session?.user?.id || 'none');

        // Update session state and cache
        setSessionAndRef(session);
        setUser(session?.user ?? null);
        apiClient.setSession(session);

        // Event-driven initialization - no timeouts, no race conditions
        // INITIAL_SESSION fires once when Supabase completes session restoration check
        if (event === 'INITIAL_SESSION') {
          if (session) {
            // Session restored from localStorage
            console.log('✅ Session restored:', session.user?.is_anonymous ? 'anonymous' : session.user?.id);
            setLoading(false);
          } else {
            // No session found - create anonymous session
            console.log('📝 No session found, creating anonymous session...');
            // Set loading=false immediately to unblock UI
            // Anonymous session will be created in background
            setLoading(false);

            // Defer async operation to avoid blocking Web Lock
            setTimeout(async () => {
              try {
                const { data, error } = await supabase!.auth.signInAnonymously();
                if (error) {
                  console.error('❌ Failed to create anonymous session:', error);
                  toast.error('Failed to initialize. Please refresh the page.');
                } else {
                  console.log('✅ Anonymous session created:', data.user?.id);
                }
              } catch (error) {
                console.error('❌ Anonymous sign-in error:', error);
                toast.error('Failed to initialize. Please refresh the page.');
              }
            }, 0);
          }
          return; // Exit early - no further processing needed for INITIAL_SESSION
        }

        // SIGNED_IN fires when OAuth/magic link callback completes
        if (event === 'SIGNED_IN') {
          console.log('✅ Sign-in completed');
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

            // Defer async migration to avoid blocking Web Lock
            setTimeout(async () => {
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
            }, 0);
          }
        }

        // Trigger migration when user signs in (from anonymous to authenticated)
        if (event === 'SIGNED_IN' && session?.user && !session.user.is_anonymous) {
          // Check if migration is needed FIRST, before any other operations
          const oldAnonUserId = localStorage.getItem('anonymous-user-id');
          const needsMigration = oldAnonUserId && oldAnonUserId !== session.user.id && !anonMigrationAttempted.current;

          // Set migration flag IMMEDIATELY to prevent race conditions
          // This blocks Editor from loading resume with wrong user_id
          if (needsMigration) {
            anonMigrationAttempted.current = true; // Prevent duplicate calls in StrictMode
            setAnonMigrationInProgress(true);
            console.log('👤 Starting migration process - blocking UI loads...');
          }

          // Show welcome toast on successful sign-in (only once per session)
          const hasShownToast = sessionStorage.getItem('login-toast-shown');
          if (!hasShownToast) {
            toast.success('Signed in successfully');
            sessionStorage.setItem('login-toast-shown', 'true');
          }

          // Defer async operations to avoid blocking Web Lock
          setTimeout(async () => {
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
            if (needsMigration) {
              console.log('👤 Migrating anonymous cloud resumes to authenticated account...');

              try {
                await migrateAnonResumes(session, oldAnonUserId);
                localStorage.removeItem('anonymous-user-id');
              } catch (error) {
                console.error('Migration failed:', error);
              } finally {
                setAnonMigrationInProgress(false);
                console.log('✅ Anonymous migration complete, UI can proceed');
              }
            } else {
              // No migration needed - ensure flag is false
              setAnonMigrationInProgress(false);
            }
          }, 0);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const showAuthModal = () => {
    setAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase not configured');

    // Store current path for redirect after auth
    sessionStorage.setItem('auth-return-to', window.location.pathname + window.location.search);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signInWithLinkedIn = async () => {
    if (!supabase) throw new Error('Supabase not configured');

    // Store current path for redirect after auth
    sessionStorage.setItem('auth-return-to', window.location.pathname + window.location.search);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error('Supabase not configured');

    console.log('🔵 Attempting to send magic link to:', email);

    // Store current path for redirect after auth
    sessionStorage.setItem('auth-return-to', window.location.pathname + window.location.search);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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

      // Reset toast flag, migration state, and auth return path
      sessionStorage.removeItem('login-toast-shown');
      sessionStorage.removeItem('auth-return-to');
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
    anonMigrationInProgress,
    migratedResumeCount,
    showAuthModal,
    hideAuthModal,
    authModalOpen,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
