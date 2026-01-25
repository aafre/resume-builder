import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock } from "react-icons/fa";

export default function Footer() {
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
        {/* Main Footer Content - Responsive Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Column 1 - Resume Templates */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Resume Templates</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/templates"
                onClick={scrollToTop('/templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                All Templates
              </Link>
              <Link
                to="/templates/modern-resume-templates"
                onClick={scrollToTop('/templates/modern-resume-templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Modern Templates
              </Link>
              <Link
                to="/templates/minimalist-resume-templates"
                onClick={scrollToTop('/templates/minimalist-resume-templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Minimalist Templates
              </Link>
              <Link
                to="/templates/resume-templates-for-students"
                onClick={scrollToTop('/templates/resume-templates-for-students')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Student Templates
              </Link>
              <Link
                to="/cv-templates"
                onClick={scrollToTop('/cv-templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                CV Templates (UK)
              </Link>
            </div>
          </div>

          {/* Column 2 - Resume Examples */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Resume Examples</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/examples"
                onClick={scrollToTop('/examples')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                All Examples
              </Link>
              <Link
                to="/examples/software-engineer"
                onClick={scrollToTop('/examples/software-engineer')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Software Engineer
              </Link>
              <Link
                to="/examples/project-manager"
                onClick={scrollToTop('/examples/project-manager')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Project Manager
              </Link>
              <Link
                to="/examples/customer-service"
                onClick={scrollToTop('/examples/customer-service')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Customer Service
              </Link>
              <Link
                to="/examples/registered-nurse"
                onClick={scrollToTop('/examples/registered-nurse')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Registered Nurse
              </Link>
            </div>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/resume-keywords"
                onClick={scrollToTop('/resume-keywords')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Resume Keywords
              </Link>
              <Link
                to="/blog"
                onClick={scrollToTop('/blog')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Career Blog
              </Link>
              <Link
                to="/blog/chatgpt-resume-prompts"
                onClick={scrollToTop('/blog/chatgpt-resume-prompts')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                ChatGPT Resume Prompts
              </Link>
              <Link
                to="/blog/ats-resume-optimization"
                onClick={scrollToTop('/blog/ats-resume-optimization')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                ATS Optimization Guide
              </Link>
              <Link
                to="/ats-resume-templates"
                onClick={scrollToTop('/ats-resume-templates')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                ATS Resume Templates
              </Link>
            </div>
          </div>

          {/* Column 4 - Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Company</h3>
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
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                onClick={scrollToTop('/terms-of-service')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                Terms of Service
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
