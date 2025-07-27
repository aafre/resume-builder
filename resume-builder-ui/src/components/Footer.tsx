import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaUsers } from "react-icons/fa";

interface FooterProps {
  isEditorPage?: boolean;
  showAboveToolbar?: boolean;
}

export default function Footer({
  isEditorPage = false,
  showAboveToolbar = false,
}: FooterProps) {
  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Left Section - Links */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-6">
              <Link 
                to="/privacy-policy" 
                className="text-blue-600 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-blue-600 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Center Section - Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} <span className="font-semibold">EasyFreeResume.com</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              Build professional resumes effortlessly
            </p>
          </div>

          {/* Right Section - Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-xs">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
              <FaShieldAlt className="text-green-600" />
              <span className="text-green-700 font-medium">GDPR</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
              <FaLock className="text-blue-600" />
              <span className="text-blue-700 font-medium">SSL</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
              <FaUsers className="text-yellow-600" />
              <span className="text-yellow-700 font-medium">50K+ Users</span>
            </div>
          </div>
        </div>

        {/* Mobile Trust Badges - Simplified */}
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200/60">
          <div className="flex justify-center gap-8 text-xs text-gray-500">
            <span>🔒 Secure</span>
            <span>🛡️ Private</span>
            <span>👥 Trusted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
