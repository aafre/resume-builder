import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEditorContext } from "../contexts/EditorContext";
import AutoSaveIndicator from "./AutoSaveIndicator";
import logo from "/android-chrome-192x192.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely get editor context (might not be available)
  const isEditorPage = location.pathname === "/editor";
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
        return "Edit Your Resume";
      default:
        return "";
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          {/* Logo and Home Navigation */}
          <div
            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="EasyFreeResume Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-2">
              EasyFreeResume
            </span>
          </div>

          {/* Dynamic Page Title - Centered */}
          {getPageTitle() && (
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 whitespace-nowrap">
                {getPageTitle()}
              </h1>
            </div>
          )}

          {/* Navigation and Right Side Content */}
          <div className="flex items-center gap-6">
            {/* Navigation Menu (hidden on mobile) */}
            {location.pathname !== "/editor" && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/blog" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Blog
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Contact
                </Link>
              </nav>
            )}

            {/* CTA Button */}
            {location.pathname === "/" && (
              <button
                onClick={() => navigate("/templates")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </button>
            )}
          </div>
          
          {/* Auto-Save Indicator (only on editor page) */}
          {isEditorPage && editorContext && (
            <div className="flex items-center justify-end min-w-0">
              <AutoSaveIndicator
                lastSaved={editorContext.lastSaved}
                isSaving={editorContext.isSaving}
                hasError={editorContext.saveError}
              />
            </div>
          )}
        </div>
        
        {/* Mobile Page Title */}
        {getPageTitle() && (
          <div className="md:hidden mt-3 text-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
}
