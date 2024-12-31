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
    <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* Logo and Home Navigation */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="EasyFreeResume Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold text-blue-500 ml-2">
            EasyFreeResume
          </span>
        </div>

        {/* Dynamic Page Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            {getPageTitle()}
          </h1>
        </div>

        {/* Action Button (only on the home page) */}
        {location.pathname === "/" && (
          <button
            onClick={() => navigate("/templates")}
            className="bg-blue-500 text-white py-2 px-6 rounded-full text-sm font-medium shadow-md hover:bg-blue-600 transition-all"
          >
            Get Started
          </button>
        )}
      </div>
    </header>
  );
}
