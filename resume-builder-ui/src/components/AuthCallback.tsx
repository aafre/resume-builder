import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthCallback handles OAuth/magic link redirects from Supabase.
 *
 * Flow:
 * 1. User initiates sign-in → stored return path in sessionStorage
 * 2. Supabase redirects to /auth/callback with tokens or error params
 * 3. This component:
 *    - On error: shows toast, redirects to /
 *    - On success: waits for auth state, redirects to stored path
 *
 * Supabase automatically processes URL hash/params via detectSessionInUrl.
 * We just need to handle errors and redirect after auth state updates.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [errorHandled, setErrorHandled] = useState(false);

  // Check for OAuth errors in URL params
  useEffect(() => {
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');

    if (error || errorCode) {
      // Show user-friendly message based on error type
      if (errorCode === 'bad_oauth_state') {
        toast.error('Sign-in link expired or already used. Please try signing in again.', {
          duration: 6000,
          id: 'auth-error', // Prevent duplicate toasts
        });
      } else if (errorCode === 'access_denied') {
        toast.error('Sign-in was cancelled. Please try again.', {
          duration: 5000,
          id: 'auth-error',
        });
      } else {
        toast.error('Sign-in failed. Please try again.', {
          duration: 5000,
          id: 'auth-error',
        });
      }

      // Clean up and redirect to home
      sessionStorage.removeItem('auth-return-to');
      setErrorHandled(true);
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  // Handle successful auth - redirect to stored path
  useEffect(() => {
    // Skip if we handled an error or still loading
    if (errorHandled || loading) return;

    // Skip if there are error params (will be handled by error effect)
    if (searchParams.get('error') || searchParams.get('error_code')) return;

    // Wait for authentication to complete
    if (isAuthenticated) {
      const returnTo = sessionStorage.getItem('auth-return-to') || '/';
      sessionStorage.removeItem('auth-return-to');
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, loading, errorHandled, searchParams, navigate]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
