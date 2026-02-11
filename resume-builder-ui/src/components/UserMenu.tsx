import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdLogout, MdFolder, MdExpandMore, MdViewModule } from 'react-icons/md';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useQueryClient } from '@tanstack/react-query';

const UserMenu: React.FC = () => {
  const { user, signOut, isAnonymous, signingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsOpen(false); // Close menu immediately for better UX

      await signOut();

      // Invalidate all queries to clear stale data
      queryClient.clear();

      // Navigate to home
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Error toast already shown in AuthContext
    }
  };

  const handleMyResumes = () => {
    setIsOpen(false);
    navigate('/my-resumes');
  };

  if (!user) return null;

  // Get display name and avatar
  const displayName = isAnonymous
    ? 'Guest'
    : user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const { avatarUrl, hasError, handleError } = useUserAvatar(user);

  return (
    <div className="relative" ref={menuRef} data-testid="user-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300"
        aria-label="User menu"
        data-testid="user-menu-button"
      >
        {avatarUrl && !hasError ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/20"
            width="32"
            height="32"
            onError={handleError}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-700">{displayName}</span>
        <MdExpandMore className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-accent/10 border border-white/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Navigation Links - Mobile Only */}
          {!isAnonymous && (
            <div className="lg:hidden border-b border-gray-100/50 pb-2">
              <Link
                to="/my-resumes"
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 my-1 transition-all duration-200 ${
                  location.pathname === '/my-resumes'
                    ? 'bg-accent/[0.06] text-ink/80 font-semibold'
                    : 'text-gray-700 hover:bg-accent/[0.06]'
                }`}
              >
                <MdFolder size={18} className={location.pathname === '/my-resumes' ? 'text-accent' : 'text-gray-500'} />
                <span>My Resumes</span>
              </Link>
              <Link
                to="/templates"
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 my-1 transition-all duration-200 ${
                  location.pathname === '/templates'
                    ? 'bg-accent/[0.06] text-ink/80 font-semibold'
                    : 'text-gray-700 hover:bg-accent/[0.06]'
                }`}
              >
                <MdViewModule size={18} className={location.pathname === '/templates' ? 'text-accent' : 'text-gray-500'} />
                <span>Templates</span>
              </Link>
            </div>
          )}

          <div className="px-4 py-3 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            {!isAnonymous && user.email && (
              <p className="text-xs text-gray-500">{user.email}</p>
            )}
            {isAnonymous && (
              <p className="text-xs text-amber-600 font-medium">Anonymous (resumes saved locally)</p>
            )}
          </div>

          {!isAnonymous && (
            <button
              onClick={handleMyResumes}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-accent/[0.06] rounded-lg mx-2 my-1 transition-all duration-200"
            >
              <MdFolder size={18} className="text-accent" />
              <span>My Resumes</span>
            </button>
          )}

          <div className="border-t border-gray-100/50 mt-1 pt-1">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/70 rounded-lg mx-2 my-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="sign-out-button"
            >
              {signingOut ? (
                <>
                  <div className="w-[18px] h-[18px] border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <MdLogout size={18} />
                  <span>{isAnonymous ? 'Start Fresh' : 'Sign Out'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
