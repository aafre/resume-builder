import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [hasMigrated, setHasMigrated] = useState(false);
  const migrationAttempted = useRef(false);

  // Helper function to check if there's unsaved work in localStorage
  const checkForUnsavedWork = () => {
    try {
      const autoSaveData = localStorage.getItem('resume-autosave');
      if (!autoSaveData) return null;

      const parsed = JSON.parse(autoSaveData);

      // Check if there's meaningful content (not just empty data)
      const hasContactInfo = parsed.contactInfo && Object.keys(parsed.contactInfo).some(key =>
        parsed.contactInfo[key] && String(parsed.contactInfo[key]).trim() !== ''
      );
      const hasSections = parsed.sections && parsed.sections.length > 0;
      const hasIcons = parsed.iconRegistry && Object.keys(parsed.iconRegistry).length > 0;

      if (hasContactInfo || hasSections || hasIcons) {
        return parsed;
      }

      return null;
    } catch (error) {
      console.error('Error checking localStorage:', error);
      return null;
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

    let isInitializing = false;

    // Initialize auth state
    const initializeAuth = async () => {
      // Prevent duplicate initialization (React Strict Mode in dev)
      if (isInitializing) return;
      isInitializing = true;

      try {
        // Check for existing session
        const { data: { session: existingSession } } = await supabase!.auth.getSession();

        if (existingSession) {
          // User has existing session (anonymous or authenticated)
          setSession(existingSession);
          setUser(existingSession.user);
          console.log('Existing session restored:', existingSession.user.id);
        } else {
          // No session - create anonymous session automatically
          console.log('No session found, signing in anonymously...');
          const { data, error } = await supabase!.auth.signInAnonymously();

          if (error) {
            console.error('Anonymous sign-in error:', error);
          } else if (data.session && data.user) {
            setSession(data.session);
            setUser(data.user);
            console.log('Anonymous session created:', data.user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        isInitializing = false;
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

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
    if (!supabase) return;

    // Sign out current user
    await supabase.auth.signOut();

    // Reset toast flag so user sees welcome message on next sign-in
    sessionStorage.removeItem('login-toast-shown');

    // Clear stored anonymous user ID (migration already happened)
    localStorage.removeItem('anonymous-user-id');

    // Reset migration attempted flag for next sign-in
    migrationAttempted.current = false;

    // Immediately create new anonymous session
    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('Error creating new anonymous session:', error);
    } else {
      console.log('New anonymous session created after sign-out');
    }
  };

  // Compute derived auth state
  const isAnonymous = user?.is_anonymous ?? false;
  const isAuthenticated = !!user && !isAnonymous;

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    isAnonymous,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
