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
    <header className="bg-white/95 backdrop-blur-xl border-b border-white/50 shadow-xl shadow-purple-500/5 sticky top-0 z-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, #8b5cf6 2px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between relative">
          {/* Logo and Home Navigation */}
          <div
            className="group flex items-center cursor-pointer hover:scale-105 transition-all duration-300 relative"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="EasyFreeResume Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" 
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent ml-2 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-600 transition-all duration-300">
              EasyFreeResume
            </span>
          </div>

          {/* Dynamic Page Title - Centered */}
          {getPageTitle() && (
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl lg:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent whitespace-nowrap tracking-tight">
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
                  className="group relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-purple-50/80 hover:scale-105"
                >
                  <span className="relative z-10">Blog</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/about" 
                  className="group relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-purple-50/80 hover:scale-105"
                >
                  <span className="relative z-10">About</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/contact" 
                  className="group relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-purple-50/80 hover:scale-105"
                >
                  <span className="relative z-10">Contact</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </nav>
            )}

            {/* CTA Button */}
            {location.pathname === "/" && (
              <button
                onClick={() => navigate("/templates")}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-xl text-sm font-semibold shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 ease-out"></div>
                <span className="relative z-10">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </span>
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
            <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
}
