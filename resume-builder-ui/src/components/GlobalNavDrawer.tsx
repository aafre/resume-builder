import { useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import useFocusTrap from "../hooks/useFocusTrap";
import type { NavLink } from "../config/navLinks";

interface GlobalNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
  resumeCount: number;
  isAuthenticated: boolean;
  onSignInClick: () => void;
}

/**
 * Global site navigation for phones and tablets.
 *
 * Distinct from MobileNavigationDrawer, which is editor chrome and navigates
 * resume *sections*. This one navigates the site and is the only way a signed
 * out phone visitor can reach Templates or Examples from the header.
 */
export default function GlobalNavDrawer({
  isOpen,
  onClose,
  links,
  currentPath,
  resumeCount,
  isAuthenticated,
  onSignInClick,
}: GlobalNavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, drawerRef, onClose);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="global-nav-drawer"
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-[9999] lg:hidden shadow-xl
          animate-slide-in-right flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 pl-4 pr-2">
          <span className="font-display text-base font-extrabold tracking-tight text-ink">
            EasyFreeResume
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink/70 transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2" aria-label="Site">
          {links.map(({ path, label, countBadge }) => {
            const isCurrent = currentPath === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset ${
                  isCurrent
                    ? "bg-black/5 font-bold text-ink"
                    : "font-medium text-gray-700 hover:bg-black/5 hover:text-ink"
                }`}
              >
                <span>{label}</span>
                {countBadge && resumeCount > 0 && (
                  <span className="min-w-[20px] rounded-full bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-ink">
                    {resumeCount > 99 ? "99+" : resumeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {!isAuthenticated && (
          <div className="safe-area-inset-bottom border-t border-gray-200 px-3 pt-3">
            <Link
              to="/templates"
              onClick={onClose}
              className="btn-primary w-full px-5 text-sm font-bold"
            >
              Create Free Resume
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignInClick();
              }}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-ink transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </>
  );
}
