import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdFolder, MdExpandMore } from 'react-icons/md';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useQueryClient } from '@tanstack/react-query';

const UserMenu: React.FC = () => {
  const { user, signOut, isAnonymous, signingOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // The panel outlives `isOpen` by the length of its exit transition, so
  // closing is animated rather than a disappearance. It is not simply left
  // mounted: a closed panel that is only hidden by CSS is still real to a
  // screen reader if the stylesheet has not applied.
  const [panelMounted, setPanelMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  // Escape closes the menu and hands focus back to the trigger
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPanelMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setPanelMounted(false), 280);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

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
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-11 items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
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
        <span className="hidden sm:block text-sm font-medium text-ink">{displayName}</span>
        <MdExpandMore className={`text-ink/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel. Deliberately a disclosure, not an ARIA menu: the
          trigger carries aria-expanded and the contents are ordinary buttons.
          role="menu" would promise Arrow/Home/End navigation and focus-on-open
          that this does not implement, which is worse than no role at all. */}
      {panelMounted && (
      <div
        data-open={isOpen}
        className="menu-pop absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 py-2 z-50"
      >
        <div className="px-4 py-3 border-b border-gray-200/50">
          <p className="text-sm font-semibold text-ink">{displayName}</p>
          {!isAnonymous && user.email && (
            <p className="text-xs text-ink/60">{user.email}</p>
          )}
          {isAnonymous && (
            <p className="text-xs text-ink/60 font-medium">Guest — resumes saved on this device</p>
          )}
        </div>

        {!isAnonymous && (
          <button
            onClick={handleMyResumes}
            className="w-full flex min-h-11 items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-accent/[0.06] rounded-lg mx-2 my-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset"
          >
            <MdFolder size={18} className="text-accent-text" />
            <span>My Resumes</span>
          </button>
        )}

        <div className="border-t border-gray-200/50 mt-1 pt-1">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex min-h-11 items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/70 rounded-lg mx-2 my-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset"
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
