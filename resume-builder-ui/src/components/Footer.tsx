import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock } from "react-icons/fa";

// Footer link definitions for maintainability
const footerLinks = {
  resumeBuilder: [
    { path: '/free-resume-builder-no-sign-up', label: 'Free Resume Builder' },
    { path: '/actual-free-resume-builder', label: '100% Free Builder' },
    { path: '/best-free-resume-builder-reddit', label: 'Best Free Builder' },
    { path: '/free-cv-builder-no-sign-up', label: 'Free CV Builder (UK)' },
    { path: '/ats-resume-templates', label: 'ATS Resume Templates' },
  ],
  resumeTemplates: [
    { path: '/templates', label: 'All Templates' },
    { path: '/templates/modern-resume-templates', label: 'Modern Templates' },
    { path: '/templates/minimalist-resume-templates', label: 'Minimalist Templates' },
    { path: '/templates/resume-templates-for-students', label: 'Student Templates' },
    { path: '/cv-templates', label: 'CV Templates (UK)' },
  ],
  resumeExamples: [
    { path: '/examples', label: 'All Examples' },
    { path: '/examples/software-engineer', label: 'Software Engineer' },
    { path: '/examples/project-manager', label: 'Project Manager' },
    { path: '/examples/customer-service-representative', label: 'Customer Service' },
    { path: '/examples/registered-nurse', label: 'Registered Nurse' },
  ],
  resources: [
    { path: '/resume-keywords', label: 'Resume Keywords' },
    { path: '/blog', label: 'Career Blog' },
    { path: '/blog/chatgpt-resume-prompts', label: 'ChatGPT Resume Prompts' },
    { path: '/blog/ats-resume-optimization', label: 'ATS Optimization Guide' },
    { path: '/blog/how-to-write-a-resume-guide', label: 'How to Write a Resume' },
  ],
  company: [
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms-of-service', label: 'Terms of Service' },
  ],
};

// Reusable footer column component
function FooterColumn({
  title,
  links,
  scrollToTop
}: {
  title: string;
  links: { path: string; label: string }[];
  scrollToTop: (path: string) => () => void;
}) {
  return (
    <nav aria-label={title}>
      <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              onClick={scrollToTop(path)}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          <FooterColumn title="Resume Builder" links={footerLinks.resumeBuilder} scrollToTop={scrollToTop} />
          <FooterColumn title="Resume Templates" links={footerLinks.resumeTemplates} scrollToTop={scrollToTop} />
          <FooterColumn title="Resume Examples" links={footerLinks.resumeExamples} scrollToTop={scrollToTop} />
          <FooterColumn title="Resources" links={footerLinks.resources} scrollToTop={scrollToTop} />
          <FooterColumn title="Company" links={footerLinks.company} scrollToTop={scrollToTop} />
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
              <p className="text-xs text-gray-600 mt-1">
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
