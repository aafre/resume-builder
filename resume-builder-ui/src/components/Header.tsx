import { useLocation, useNavigate } from "react-router-dom";
import logo from "/android-chrome-192x192.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

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

          {/* Action Button (only on the home page) */}
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
