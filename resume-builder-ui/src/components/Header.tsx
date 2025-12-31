import { useLocation, useNavigate, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useEditorContext } from "../contexts/EditorContext";
import { useAuth } from "../contexts/AuthContext";
import { useResumes } from "../hooks/useResumes";
import AutoSaveIndicator from "./AutoSaveIndicator";
import AnonymousWarningBadge from "./AnonymousWarningBadge";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import logo from "/android-chrome-192x192.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAnonymous, loading: authLoading, showAuthModal, hideAuthModal, authModalOpen } = useAuth();

  // Get resume count for mobile badge
  const { data: resumes = [] } = useResumes();
  const resumeCount = resumes.length;

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
    <header className="bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-lg shadow-purple-500/5 sticky top-0 z-50 relative">
      {/* Modern gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700" />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] transition-all duration-200">
          {/* Logo and Home Navigation */}
          <div
            className="group flex items-center cursor-pointer transition-all duration-200 relative flex-shrink-0"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
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
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent ml-2.5 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-600 transition-all duration-300 tracking-tight">
              EasyFreeResume
            </span>
          </div>

          {/* Navigation Buttons - Centered (Desktop, Authenticated Only) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/my-resumes"
                id="tour-my-resumes-link"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === '/my-resumes'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-md'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                My Resumes
              </Link>
              <Link
                to="/templates"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === '/templates'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-md'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                Templates
              </Link>
            </nav>
          )}

          {/* Dynamic Page Title - Centered (Desktop, Non-Authenticated) */}
          {!isAuthenticated && getPageTitle() && (
            <div className="hidden lg:flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
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
                  className="relative p-2 rounded-lg hover:bg-purple-50/50 transition-all duration-200"
                  aria-label={`My Resumes${resumeCount > 0 ? ` (${resumeCount})` : ''}`}
                >
                  <div className="relative">
                    <FileText className="w-6 h-6 text-gray-700" />
                    {resumeCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center ring-2 ring-white">
                        <span className="text-white text-[10px] font-bold px-1">
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
                    className="flex items-center gap-2 font-semibold text-sm transition-all duration-300 text-purple-600 hover:text-purple-700 hover:underline lg:py-2.5 lg:px-5 lg:bg-gradient-to-r lg:from-blue-600 lg:via-purple-600 lg:to-indigo-700 lg:text-white lg:rounded-xl lg:shadow-md lg:hover:shadow-xl lg:hover:shadow-purple-500/20 lg:hover:scale-[1.02]"
                  >
                    <span>Sign In</span>
                  </button>
                )}
              </>
            )}

            {/* CTA Button (only on homepage) */}
            {location.pathname === "/" && (
              <button
                onClick={() => navigate("/templates")}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-2.5 px-5 sm:py-3 sm:px-6 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Page Title */}
        {getPageTitle() && (
          <div className="lg:hidden pb-3 -mt-1">
            <div className="flex flex-col items-center">
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
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
