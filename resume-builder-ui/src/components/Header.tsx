import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FileText, Menu } from "lucide-react";
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

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, isAnonymous, loading: authLoading, showAuthModal, hideAuthModal, authModalOpen } = useAuth();
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // Get resume count for mobile badge (lightweight count-only query)
  const { data: resumeCount = 0 } = useResumeCount();

  const isEditorPage = location.pathname.startsWith("/editor");
  const editorContext = useOptionalEditorContext();
  const navLinks = getNavLinks(isAuthenticated);

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
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-header-mobile sm:h-header-desktop transition-all duration-200">
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

          {/* Product navigation — rendered for every visitor, not only signed-in
              ones. Only account-scoped destinations branch on auth. */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {navLinks.map(({ path, label, countBadge, id }) => (
              <Link
                key={path}
                to={path}
                id={id}
                aria-current={location.pathname === path ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
                  location.pathname === path
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-gray-600 hover:bg-black/5 hover:text-ink'
                }`}
              >
                {label}
                {countBadge && resumeCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent rounded-full flex items-center justify-center ring-2 ring-white text-ink text-[10px] font-bold px-1">
                    {resumeCount > 99 ? '99+' : resumeCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Content */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Mobile Icon Navigation - Authenticated Only */}
            {isAuthenticated && (
              <div className="lg:hidden flex items-center gap-3">
                {/* My Resumes Icon with Badge */}
                <Link
                  to="/my-resumes"
                  className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-black/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                  aria-label={`My Resumes${resumeCount > 0 ? ` (${resumeCount})` : ''}`}
                >
                  <div className="relative">
                    <FileText className="w-6 h-6 text-gray-700" />
                    {resumeCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent rounded-full flex items-center justify-center ring-2 ring-white">
                        <span className="text-ink text-[10px] font-bold px-1">
                          {resumeCount > 99 ? '99+' : resumeCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )}

            {/* Auto-Save Indicator (authenticated) or storage badge (anonymous) - only on editor page */}
            {isEditorPage && editorContext && (
              <div id="header-auth-status" className="flex items-center gap-3">
                <div id="header-job-badge-slot" />
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
            <div className="flex items-center min-w-[50px] lg:min-w-[80px] min-h-[36px] lg:min-h-[40px]">
              {!authLoading && (
                <>
                  {isAuthenticated ? (
                    <UserMenu />
                  ) : (
                    <button
                      id="tour-sign-in-button"
                      onClick={showAuthModal}
                      className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sm transition-all duration-200 text-ink hover:text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 lg:hover:no-underline lg:px-5 lg:bg-ink lg:text-white lg:shadow-sm lg:hover:shadow-md"
                    >
                      <span>Sign In</span>
                    </button>
                  )}
                </>
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

            {/* Global navigation trigger — the site had no mobile navigation at
                all. Not rendered in the editor, which has its own drawer. */}
            {!isEditorPage && (
              <button
                type="button"
                onClick={() => setNavDrawerOpen(true)}
                className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                aria-label="Open navigation menu"
                aria-haspopup="dialog"
                aria-expanded={navDrawerOpen}
                aria-controls="global-nav-drawer"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
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
                <p className="text-[11px] text-gray-600 font-medium">
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
          links={[...navLinks, { path: "/blog", label: "Career Blog" }]}
          currentPath={location.pathname}
          resumeCount={resumeCount}
          isAuthenticated={isAuthenticated}
          onSignInClick={showAuthModal}
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
