import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdLogout, MdFolder, MdExpandMore, MdViewModule } from 'react-icons/md';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useQueryClient } from '@tanstack/react-query';

const appVersion = import.meta.env.VITE_APP_VERSION || `dev-${__GIT_HASH__}`;

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
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-300 group"
        aria-label="User menu"
        data-testid="user-menu-button"
      >
        {avatarUrl && !hasError ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300"
            width="32"
            height="32"
            onError={handleError}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ink to-ink-light flex items-center justify-center shadow-md ring-2 ring-black/[0.06] group-hover:ring-accent/30 transition-all duration-300">
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
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium border border-black/[0.06] py-0 z-50 animate-menu-enter overflow-hidden">
          {/* User Identity Section */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3.5">
              {avatarUrl && !hasError ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/20 shadow-sm flex-shrink-0"
                  width="40"
                  height="40"
                  onError={handleError}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink to-ink-light flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-bold text-base">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate font-display">{displayName}</p>
                {!isAnonymous && user.email && (
                  <p className="text-xs text-stone-warm truncate">{user.email}</p>
                )}
                {isAnonymous && (
                  <p className="text-xs text-amber-600 font-medium">Guest account</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {!isAnonymous && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
              <div className="px-2 py-2">
                <Link
                  to="/my-resumes"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                    location.pathname === '/my-resumes'
                      ? 'bg-accent/[0.08] text-ink font-semibold'
                      : 'text-gray-700 hover:bg-black/[0.04]'
                  }`}
                >
                  <MdFolder size={18} className={location.pathname === '/my-resumes' ? 'text-accent' : 'text-mist'} />
                  <span>My Resumes</span>
                </Link>
                <Link
                  to="/templates"
                  onClick={() => setIsOpen(false)}
                  className={`lg:hidden flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                    location.pathname === '/templates'
                      ? 'bg-accent/[0.08] text-ink font-semibold'
                      : 'text-gray-700 hover:bg-black/[0.04]'
                  }`}
                >
                  <MdViewModule size={18} className={location.pathname === '/templates' ? 'text-accent' : 'text-mist'} />
                  <span>Templates</span>
                </Link>
              </div>
            </>
          )}

          {/* Sign Out */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
          <div className="px-2 py-2">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/70 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Version Footer */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
          <div className="px-5 py-3 bg-chalk-dark/50">
            <p className="font-mono text-[10px] tracking-[0.08em] text-mist text-center select-none">
              {appVersion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
