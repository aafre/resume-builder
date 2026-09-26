import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";
import { useOptionalEditorContext } from "../contexts/EditorContext";
import { useAuth } from "../contexts/AuthContext";
import { useResumeCount } from "../hooks/useResumeCount";
import AutoSaveIndicator from "./AutoSaveIndicator";
import AnonymousStorageBadge from "./AnonymousStorageBadge";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import LogoMark from "./LogoMark";
import GlobalNavDrawer from "./GlobalNavDrawer";
import { getNavLinks } from "../config/navLinks";
import { useJobsAvailable } from "../hooks/useJobsAvailable";
import useNavPill from "../hooks/useNavPill";
import { useAuthHint } from "../hooks/useAuthHint";
import UserAvatar from "./UserAvatar";
import NavMenuTrigger, { type NavAccount } from "./NavMenuTrigger";
import { useSignOut } from "../hooks/useSignOut";
import { navGlyphs } from "./icons/NavGlyphs";

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated: authResolved, isAnonymous, loading: authLoading, showAuthModal, hideAuthModal, authModalOpen } = useAuth();
  // While the lazy SDK loads, trust the session it will restore from. Without
  // this the header paints signed-out, then reflows 2-3s later.
  const authHint = useAuthHint();
  const isAuthenticated = authLoading ? authHint?.signedIn ?? false : authResolved;
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const signOut = useSignOut();

  // Get resume count for mobile badge (lightweight count-only query)
  const { data: resumeCount = 0 } = useResumeCount();

  const isEditorPage = location.pathname.startsWith("/editor");
  const editorContext = useOptionalEditorContext();
  // Optimistic: only a definite "unsupported" hides the link, so it never pops in late
  const jobsAvailable = useJobsAvailable() !== false;
  const navLinks = getNavLinks(isAuthenticated, jobsAvailable);

  // Identity for the mobile trigger and account card: the real user once
  // resolved, the stored-session hint until then.
  const account: NavAccount | null = !isAuthenticated
    ? null
    : user
      ? {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email,
          avatarUrl: user.user_metadata?.avatar_url,
        }
      : authHint && {
          name: authHint.name || authHint.email?.split("@")[0] || "User",
          email: authHint.email,
          avatarUrl: authHint.avatarUrl,
        };

  // The pill follows whichever link matches the route; a page with no nav
  // entry (blog, an example, the landing page) correctly has no pill.
  const activePath = navLinks.some((link) => link.path === location.pathname)
    ? location.pathname
    : null;
  const { navRef, pillRef } = useNavPill(activePath);

  // Flat at rest, glass once the page has moved. The header's box height is
  // deliberately unchanged by this — a sticky header that shrinks on scroll
  // pushes the whole document up, and a scroll-triggered shift counts against
  // CLS on a site that lives on search traffic.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/templates":
        return "Select Your Template";
      case "/editor":
        return "Resume Editor";
      case "/my-resumes":
        return "My Resumes";
      default:
        return "";
    }
  };

  const getPageSubtitle = () => {
    switch (location.pathname) {
      case "/templates":
        return "Choose a professional design";
      case "/editor":
        return "Build your professional story";
      default:
        return "";
    }
  };

  return (
    <header
      className="site-header border-b border-transparent sticky top-0 z-50"
      data-scrolled={scrolled}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-header-mobile sm:h-header-desktop transition-all duration-200">
          <div className="flex items-center">
          {/* Logo and Home Navigation */}
          <Link
            to="/"
            className="group flex min-h-11 min-w-11 items-center rounded-lg transition-all duration-200 relative flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
          >
            <LogoMark
              size={36}
              className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
            />
            <span className="hidden sm:inline text-lg sm:text-xl font-extrabold text-ink ml-2.5 tracking-tight font-display">
              EasyFreeResume
            </span>
            {/* Below sm the wordmark is not rendered, so the brand name has to
                reach a screen reader from somewhere. */}
            <span className="sr-only sm:hidden">EasyFreeResume — go to homepage</span>
          </Link>
          </div>

          {/* Product navigation — rendered for every visitor, not only signed-in
              ones. Only account-scoped destinations branch on auth. */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1 self-stretch"
            aria-label="Primary"
          >
            {/* Decoration only. `aria-current` on the link is what actually
                announces the current page. */}
            <span ref={pillRef} className="nav-rail-pill" aria-hidden="true" />
            {navLinks.map(({ path, label, countBadge, id }) => {
              const isCurrent = location.pathname === path;
              const NavGlyph = navGlyphs[path];
              return (
                <Link
                  key={path}
                  to={path}
                  id={id}
                  data-nav-key={path}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`nav-rail-link relative inline-flex min-h-11 items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
                    isCurrent
                      ? 'text-ink font-semibold'
                      : 'text-ink/60 font-medium hover:text-ink'
                  }`}
                >
                  {/* From xl only: at lg the glyphs wrap labels and the CTA. */}
                  {NavGlyph && <NavGlyph className="hidden xl:block h-5 w-5 shrink-0" />}
                  {label}
                  {countBadge && resumeCount > 0 && (
                    <span
                      key={resumeCount}
                      className="nav-badge-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent rounded-full flex items-center justify-center ring-2 ring-white text-ink text-[10px] font-bold px-1"
                    >
                      {resumeCount > 99 ? '99+' : resumeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Content */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Auto-Save Indicator (authenticated) or storage badge (anonymous) - only on editor page */}
            {isEditorPage && editorContext && (
              <div id="header-auth-status" className="flex items-center gap-3">
                {/* Phones get the one-per-session job banner instead */}
                <div id="header-job-badge-slot" className="hidden sm:flex" />
                {/* min-width reserves space regardless of which badge mounts, preventing CLS */}
                <div className="flex items-center min-w-[80px] sm:min-w-[150px] min-h-[32px]">
                  {isAuthenticated && (
                    <AutoSaveIndicator
                      lastSaved={editorContext.lastSaved}
                      isSaving={editorContext.isSaving}
                      hasError={editorContext.saveError}
                    />
                  )}
                  {isAnonymous && (
                    <AnonymousStorageBadge onSignInClick={showAuthModal} />
                  )}
                </div>
              </div>
            )}

            {/* Auth UI - User Menu or Sign In Button — fixed min-width prevents CLS on auth resolve */}
            {/* Off the editor, phones reach account through the menu trigger */}
            <div className={`${isEditorPage ? "flex" : "hidden lg:flex"} items-center min-w-[50px] lg:min-w-[80px] min-h-[36px] lg:min-h-[40px]`}>
              {authLoading && authHint?.signedIn ? (
                // Stand-in with UserMenu's exact trigger geometry; swapped for
                // the real menu when the SDK resolves, so nothing moves.
                <div className="flex min-h-11 items-center gap-2 px-3 py-2" aria-hidden="true">
                  <UserAvatar name={authHint.name || authHint.email || "U"} url={authHint.avatarUrl} />
                  <span className="hidden sm:block text-sm font-medium text-ink">
                    {authHint.name || authHint.email?.split("@")[0]}
                  </span>
                  <MdExpandMore className="text-ink/60" />
                </div>
              ) : (
                // No fade after a hinted stand-in: it would blink the avatar.
                <div className={authHint?.signedIn ? undefined : "nav-auth-in"}>
                  {authResolved ? (
                    <UserMenu />
                  ) : (
                    <button
                      id="tour-sign-in-button"
                      onClick={showAuthModal}
                      className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sm transition-colors duration-200 text-ink hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                    >
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CTA Button (all pages except editor, non-authenticated) */}
            {!isEditorPage && !isAuthenticated && location.pathname !== "/templates" && (
              <Link
                to="/templates"
                className="btn-primary px-5 sm:px-6 text-sm font-bold"
              >
                <span className="hidden sm:inline">Create Free Resume</span>
                <span className="sm:hidden">Create Resume</span>
              </Link>
            )}

            {/* One mobile entry point for navigation and account. Not
                rendered in the editor, which has its own drawer. */}
            {!isEditorPage && (
              <div className="lg:hidden">
                <NavMenuTrigger
                  open={navDrawerOpen}
                  account={account}
                  resumeCount={resumeCount}
                  onClick={() => setNavDrawerOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile/tablet page location. Deliberately not a heading — this is
            chrome, and the routed page renders the document's own <h1>. */}
        {getPageTitle() && (
          <div className="lg:hidden pb-3 -mt-1">
            <div className="flex flex-col items-center">
              <p className="text-base font-extrabold text-ink tracking-tight font-display">
                {getPageTitle()}
              </p>
              {getPageSubtitle() && (
                <p className="text-[11px] text-ink/60 font-medium">
                  {getPageSubtitle()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEditorPage && (
        <GlobalNavDrawer
          isOpen={navDrawerOpen}
          onClose={() => setNavDrawerOpen(false)}
          links={[...navLinks, { path: "/blog", label: "Career Blog", blurb: "Guides for every step of the search" }]}
          currentPath={location.pathname}
          resumeCount={resumeCount}
          isAuthenticated={isAuthenticated}
          onSignInClick={showAuthModal}
          account={account}
          onSignOut={signOut}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={hideAuthModal}
        onSuccess={hideAuthModal}
      />
    </header>
  );
}
