import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaStar } from "react-icons/fa";
import { affiliateConfig } from "../config/affiliate";

// Footer link definitions for maintainability
const footerLinks = {
  resumeBuilder: [
    { path: '/free-resume-builder-no-sign-up', label: 'Free Resume Builder' },
    { path: '/actual-free-resume-builder', label: '100% Free Builder' },
    { path: '/best-free-resume-builder-reddit', label: 'Best Free Builder' },
    { path: '/free-resume-builder-for-students', label: 'Resume Builder for Students' },
    { path: '/free-resume-builder-for-nurses', label: 'Resume Builder for Nurses' },
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
    { path: '/resume-keyword-scanner', label: 'ATS Keyword Scanner' },
    ...(affiliateConfig.jobSearch.enabled
      ? [{ path: '/jobs', label: 'Job Search' }]
      : []),
    { path: '/blog', label: 'Career Blog' },
    { path: '/blog/chatgpt-resume-prompts', label: 'ChatGPT Resume Prompts' },
    { path: '/blog/ats-resume-optimization', label: 'ATS Optimization Guide' },
    { path: '/blog/how-to-write-a-resume-guide', label: 'How to Write a Resume' },
  ],
  company: [
    { path: '/about', label: 'About Us' },
    { path: '/blog/how-why-easyfreeresume-completely-free', label: 'Why It\'s Free' },
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
              className="text-gray-600 hover:text-accent font-medium transition-colors duration-200 text-sm"
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
    <div className="bg-transparent border-t border-gray-200/60 mt-16">
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
          <div className="flex flex-col items-center gap-4">
            {/* Copyright */}
            <div className="text-center">
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
              <div className="flex items-center gap-2 bg-accent/[0.06] px-3 py-2 rounded-full">
                <FaLock className="text-accent" />
                <span className="text-ink/80 font-medium">SSL</span>
              </div>
              <a
                href="https://www.trustpilot.com/review/easyfreeresume.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-full hover:bg-emerald-100 transition-colors duration-200"
              >
                <FaStar className="text-emerald-600" />
                <span className="text-emerald-700 font-medium">Trustpilot</span>
              </a>
              <a
                href="https://www.crunchbase.com/organization/easyfreeresume"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.6 0H2.4A2.41 2.41 0 0 0 0 2.4v19.2A2.41 2.41 0 0 0 2.4 24h19.2a2.41 2.41 0 0 0 2.4-2.4V2.4A2.41 2.41 0 0 0 21.6 0zM7.045 14.465A2.11 2.11 0 0 0 9.84 13.42h1.86a3.97 3.97 0 1 1 0-2.85H9.84a2.11 2.11 0 1 0-2.795 3.895zm7.809 2.55a3.96 3.96 0 0 1-1.975-3.415V12a3.96 3.96 0 1 1 5.934 3.424V17h-1.8v-1.11a3.98 3.98 0 0 1-2.159 1.125zm2.159-3.96a2.16 2.16 0 1 0-4.32 0 2.16 2.16 0 0 0 4.32 0z" />
                </svg>
                <span className="text-blue-700 font-medium">Crunchbase</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
