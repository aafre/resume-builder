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
    <footer className="bg-transparent border-t border-gray-200/60 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1 - Popular Resumes */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Popular Resumes</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/resume-keywords/software-engineer"
                onClick={scrollToTop('/resume-keywords/software-engineer')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Software Engineer
              </Link>
              <Link
                to="/resume-keywords/customer-service"
                onClick={scrollToTop('/resume-keywords/customer-service')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Customer Service
              </Link>
              <Link
                to="/resume-keywords/data-scientist"
                onClick={scrollToTop('/resume-keywords/data-scientist')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Data Scientist
              </Link>
              <Link
                to="/resume-keywords/product-manager"
                onClick={scrollToTop('/resume-keywords/product-manager')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Product Manager
              </Link>
              <Link
                to="/resume-keywords/project-manager"
                onClick={scrollToTop('/resume-keywords/project-manager')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Project Manager
              </Link>
            </div>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/blog"
                onClick={scrollToTop('/blog')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Career Blog
              </Link>
              <Link
                to="/resume-keywords"
                onClick={scrollToTop('/resume-keywords')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Resume Keywords Hub
              </Link>
              <Link
                to="/templates"
                onClick={scrollToTop('/templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Templates
              </Link>
            </div>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/about"
                onClick={scrollToTop('/about')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={scrollToTop('/contact')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Contact
              </Link>
              <Link
                to="/privacy-policy"
                onClick={scrollToTop('/privacy-policy')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Privacy
              </Link>
              <Link
                to="/terms-of-service"
                onClick={scrollToTop('/terms-of-service')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Trust Badges */}
        <div className="pt-8 border-t border-gray-200/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()}{" "}
                <span className="font-semibold">EasyFreeResume.com</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Build professional resumes effortlessly
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
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
        </div>
      </div>
    </footer>
  );
}
