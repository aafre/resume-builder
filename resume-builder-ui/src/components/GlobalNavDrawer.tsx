import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";
import useFocusTrap from "../hooks/useFocusTrap";
import type { NavLink } from "../config/navLinks";
import LogoMark from "./LogoMark";
import UserAvatar from "./UserAvatar";
import NavMenuTrigger, { type NavAccount } from "./NavMenuTrigger";

interface GlobalNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
  resumeCount: number;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  /** Signed-in identity for the account card; null for guests */
  account?: NavAccount | null;
  onSignOut?: () => void;
}

/** Matches the exit transition in styles.css (.nav-sheet[data-open="false"]). */
const EXIT_MS = 280;

/**
 * Global site navigation and account for phones and tablets.
 *
 * Distinct from MobileNavigationDrawer, which is editor chrome and navigates
 * resume *sections*. This sheet unfolds from the header itself: its top row
 * repeats the header bar, and the rest is revealed below it by clip-path, so
 * menu and account read as one surface instead of two competing menus.
 */
export default function GlobalNavDrawer({
  isOpen,
  onClose,
  links,
  currentPath,
  resumeCount,
  isAuthenticated,
  onSignInClick,
  account = null,
  onSignOut,
}: GlobalNavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Outlives `isOpen` by the exit transition so closing folds the sheet back
  // into the header instead of cutting it.
  const [mounted, setMounted] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useFocusTrap(isOpen, drawerRef, onClose);

  // The sheet is `lg:hidden`, so widening past the breakpoint hides it
  // without closing it — leaving the focus trap swallowing Tab against a
  // panel nobody can see. Close on the breakpoint instead of relying on CSS.
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) {
      onCloseRef.current();
      return;
    }
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) onCloseRef.current();
    };
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, [isOpen]);

  // aria-modal="true" is a promise that the rest of the page is inert; without
  // this the page scrolls behind the sheet and reopens at a different offset.
  // Body only, never html — see the overflow note in CLAUDE.md.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  // My Resumes lives in the account card, not the list.
  const rows = links.filter((link) => !link.countBadge);

  // Portalled to <body> because Header carries a backdrop filter once
  // scrolled, and a filtered ancestor becomes the containing block for fixed
  // descendants — which clamped this to the header's height.
  return createPortal(
    <>
      <div
        className="nav-drawer-backdrop fixed inset-0 z-[9998] bg-ink/40 lg:hidden"
        data-open={isOpen}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="global-nav-drawer"
        ref={drawerRef}
        data-open={isOpen}
        className="nav-sheet fixed inset-x-0 top-0 z-[9999] max-h-[100dvh] overflow-y-auto overscroll-contain bg-white shadow-2xl lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* The header bar, repeated, so the sheet reads as the header grown */}
          <div className="flex h-header-mobile items-center justify-between sm:h-header-desktop">
            <Link
              to="/"
              onClick={onClose}
              className="flex min-h-11 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
            >
              <LogoMark size={36} className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="ml-2.5 font-display text-lg font-extrabold tracking-tight text-ink">
                EasyFreeResume
              </span>
            </Link>
            <NavMenuTrigger open={isOpen} account={account} resumeCount={resumeCount} onClick={onClose} />
          </div>

          {/* Account */}
          <div className="nav-drawer-item mt-2" style={{ "--i": 0 } as React.CSSProperties}>
            {isAuthenticated && account ? (
              <Link
                to="/my-resumes"
                onClick={onClose}
                aria-current={currentPath === "/my-resumes" ? "page" : undefined}
                className="flex min-h-16 items-center gap-3 rounded-xl bg-chalk-dark p-3 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset"
              >
                <UserAvatar name={account.name} url={account.avatarUrl} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-ink">{account.name}</span>
                  <span className="block truncate text-sm text-ink/60">
                    My Resumes
                    {resumeCount > 0 && <> · {resumeCount} saved</>}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink/40" aria-hidden="true" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-chalk-dark p-3">
                <p className="min-w-0 flex-1 text-sm leading-snug text-ink/60">
                  <span className="block font-semibold text-ink">No account needed</span>
                  Sign in only to save up to 5 resumes across devices.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignInClick();
                  }}
                  className="btn-secondary shrink-0 px-4 py-2 text-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          <nav className="mt-3 flex flex-col gap-1" aria-label="Site">
            {rows.map(({ path, label, blurb, icon: Icon }, index) => {
              const isCurrent = currentPath === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onClose}
                  aria-current={isCurrent ? "page" : undefined}
                  style={{ "--i": index + 1 } as React.CSSProperties}
                  className={`nav-drawer-item group flex min-h-14 items-center gap-3 rounded-xl px-2 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset ${
                    isCurrent ? "bg-black/[0.04]" : "hover:bg-black/[0.04]"
                  }`}
                >
                  {Icon && (
                    // Current page mirrors the desktop rail: ink tile, like the ink pill
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isCurrent ? "bg-ink text-accent" : "bg-chalk-dark text-ink"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[15px] text-ink ${isCurrent ? "font-bold" : "font-semibold"}`}>
                      {label}
                    </span>
                    {blurb && <span className="block truncate text-sm text-ink/60">{blurb}</span>}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div
            className="nav-drawer-item safe-area-inset-bottom mt-3 border-t border-black/[0.06] pt-3"
            style={{ "--i": rows.length + 1 } as React.CSSProperties}
          >
            {isAuthenticated ? (
              onSignOut && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </button>
              )
            ) : (
              <Link to="/templates" onClick={onClose} className="btn-primary w-full px-5 text-sm font-bold">
                Create Free Resume
              </Link>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
