import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

/** Sign out, drop cached queries, and land on home. Errors toast in AuthContext. */
export function useSignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    try {
      await signOut();
      queryClient.clear();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
}
