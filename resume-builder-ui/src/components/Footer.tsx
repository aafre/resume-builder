import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock } from "react-icons/fa";

interface FooterProps {
  isEditorPage?: boolean;
  showAboveToolbar?: boolean;
}

export default function Footer({}: FooterProps) {
 const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = (path: string) => () => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };
  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Left Section - Links */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
              <Link
                to="/blog"
                onClick={scrollToTop('/blog')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Career Blog
              </Link>
              <Link
                to="/about"
                onClick={scrollToTop('/about')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={scrollToTop('/contact')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                to="/privacy-policy"
                onClick={scrollToTop('/privacy-policy')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms-of-service"
                onClick={scrollToTop('/terms-of-service')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Center Section - Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold">EasyFreeResume.com</span>
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
