import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
 * repeats the header bar, and the rest is revealed below it by clip-path.
 * It is a full-height index — big type, one destination per line — with the
 * account and the primary action docked at the bottom, in thumb reach.
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

  // My Resumes lives in the account dock, not the index.
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
        className="nav-sheet fixed inset-0 z-[9999] overflow-y-auto overscroll-contain bg-chalk lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
      >
        <div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 sm:px-6">
          {/* The header bar, repeated, so the sheet reads as the header grown */}
          <div className="flex h-header-mobile shrink-0 items-center justify-between sm:h-header-desktop">
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

          <nav className="mt-4 border-t border-black/[0.06]" aria-label="Site">
            <ol>
              {rows.map(({ path, label, blurb }, index) => {
                const isCurrent = currentPath === path;
                return (
                  <li
                    key={path}
                    className="nav-drawer-item border-b border-black/[0.06]"
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    <Link
                      to={path}
                      onClick={onClose}
                      aria-current={isCurrent ? "page" : undefined}
                      className="group flex min-h-16 items-baseline gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset"
                    >
                      <span
                        className={`w-6 shrink-0 font-mono text-[11px] tracking-[0.15em] ${isCurrent ? "text-accent-text" : "text-ink/60"}`}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2.5 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink">
                          {label}
                          {isCurrent && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />}
                        </span>
                        {blurb && (
                          <span className="mt-1 block text-[15px] font-extralight leading-snug text-ink/60">{blurb}</span>
                        )}
                      </span>
                      <ArrowRight
                        className="h-5 w-5 shrink-0 self-center text-ink/60 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Account and the primary action, docked where a thumb already is */}
          <div
            className="nav-drawer-item safe-area-inset-bottom mt-auto pt-8"
            style={{ "--i": rows.length } as React.CSSProperties}
          >
            {isAuthenticated && account ? (
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
                <UserAvatar name={account.name} url={account.avatarUrl} size={40} />
                <Link
                  to="/my-resumes"
                  onClick={onClose}
                  aria-current={currentPath === "/my-resumes" ? "page" : undefined}
                  className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                >
                  <span className="block truncate text-[15px] font-semibold text-ink">{account.name}</span>
                  <span className="block truncate text-sm text-ink/60">
                    My Resumes
                    {resumeCount > 0 && <> · {resumeCount} saved</>}
                  </span>
                </Link>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-medium text-ink/60 transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mb-3 text-sm font-extralight text-ink/60">
                  <span className="font-semibold text-ink">No account needed</span>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignInClick();
                    }}
                    className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
                  >
                    Sign In
                  </button>{" "}
                  to save up to 5 resumes.
                </p>
                <Link to="/templates" onClick={onClose} className="btn-primary w-full px-5 text-base font-bold">
                  Create Free Resume
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
