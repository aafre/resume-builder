import { useLocation, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useEditorContext } from "../contexts/EditorContext";
import { useAuth } from "../contexts/AuthContext";
import { useResumeCount } from "../hooks/useResumeCount";
import AutoSaveIndicator from "./AutoSaveIndicator";
import AnonymousWarningBadge from "./AnonymousWarningBadge";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import logo from "/logo-80.webp";

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, isAnonymous, loading: authLoading, showAuthModal, hideAuthModal, authModalOpen } = useAuth();

  // Get resume count for mobile badge (lightweight count-only query)
  const { data: resumeCount = 0 } = useResumeCount();

  // Safely get editor context (might not be available)
  const isEditorPage = location.pathname.startsWith("/editor");
  let editorContext = null;

  try {
    // Always call the hook to maintain hook order
    editorContext = useEditorContext();
  } catch {
    // Context not available, which is fine for non-editor pages
    editorContext = null;
  }

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
    <header className="bg-white/95 backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-50 relative">
      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] transition-all duration-200">
          {/* Logo and Home Navigation */}
          <Link
            to="/"
            className="group flex items-center transition-all duration-200 relative flex-shrink-0"
            aria-label="Go to homepage"
          >
            <div className="relative">
              <img
                src={logo}
                alt="EasyFreeResume Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
                width="36"
                height="36"
              />
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl font-extrabold text-ink ml-2.5 tracking-tight font-display">
              EasyFreeResume
            </span>
          </Link>

          {/* Navigation Buttons - Centered (Desktop, Authenticated Only) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/my-resumes"
                id="tour-my-resumes-link"
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === '/my-resumes'
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-gray-600 hover:bg-black/5 hover:text-ink'
                }`}
              >
                My Resumes
                {resumeCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent rounded-full flex items-center justify-center ring-2 ring-white text-ink text-[10px] font-bold px-1">
                    {resumeCount > 99 ? '99+' : resumeCount}
                  </span>
                )}
              </Link>
              <Link
                to="/templates"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === '/templates'
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-gray-600 hover:bg-black/5 hover:text-ink'
                }`}
              >
                Templates
              </Link>
            </nav>
          )}

          {/* Dynamic Page Title - Centered (Desktop, Non-Authenticated) */}
          {!isAuthenticated && getPageTitle() && (
            <div className="hidden lg:flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-extrabold text-ink tracking-tight font-display">
                {getPageTitle()}
              </h1>
              {getPageSubtitle() && (
                <p className="text-xs text-gray-600 font-medium -mt-0.5">
                  {getPageSubtitle()}
                </p>
              )}
            </div>
          )}

          {/* Right Side Content */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Mobile Icon Navigation - Authenticated Only */}
            {isAuthenticated && (
              <div className="lg:hidden flex items-center gap-3">
                {/* My Resumes Icon with Badge */}
                <Link
                  to="/my-resumes"
                  className="relative p-2 rounded-lg hover:bg-black/5 transition-all duration-200"
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

            {/* Auto-Save Indicator (authenticated) or Warning Badge (anonymous) - only on editor page */}
            {isEditorPage && editorContext && (
              <div id="header-auth-status" className="flex items-center">
                {isAuthenticated && (
                  <AutoSaveIndicator
                    lastSaved={editorContext.lastSaved}
                    isSaving={editorContext.isSaving}
                    hasError={editorContext.saveError}
                  />
                )}
                {isAnonymous && (
                  <AnonymousWarningBadge onSignInClick={showAuthModal} />
                )}
              </div>
            )}

            {/* Auth UI - User Menu or Sign In Button */}
            {!authLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <button
                    id="tour-sign-in-button"
                    onClick={showAuthModal}
                    className="flex items-center gap-2 py-2 font-semibold text-sm transition-all duration-300 text-ink hover:text-accent hover:underline lg:hover:no-underline lg:py-2.5 lg:px-5 lg:bg-ink lg:text-white lg:rounded-xl lg:shadow-sm lg:hover:shadow-md lg:hover:scale-[1.02]"
                  >
                    <span>Sign In</span>
                  </button>
                )}
              </>
            )}

            {/* CTA Button (only on homepage, non-authenticated) */}
            {location.pathname === "/" && !isAuthenticated && (
              <Link
                to="/templates"
                className="bg-accent text-ink py-2.5 px-5 sm:py-3 sm:px-6 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:shadow-accent/20 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Page Title */}
        {getPageTitle() && (
          <div className="lg:hidden pb-3 -mt-1">
            <div className="flex flex-col items-center">
              <h1 className="text-base font-extrabold text-ink tracking-tight font-display">
                {getPageTitle()}
              </h1>
              {getPageSubtitle() && (
                <p className="text-[11px] text-gray-600 font-medium">
                  {getPageSubtitle()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={hideAuthModal}
        onSuccess={hideAuthModal}
      />
    </header>
  );
}
