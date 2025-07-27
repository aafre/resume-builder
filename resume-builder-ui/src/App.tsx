import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import TemplateCarousel from "./components/TemplateCarousel";
import Editor from "./components/Editor";
import NotFound from "./components/NotFound";
import ErrorPage from "./components/ErrorPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import BlogIndex from "./components/BlogIndex";
import ResumeMistakesToAvoid from "./components/blog/ResumeMistakesToAvoid";
import ATSOptimization from "./components/blog/ATSOptimization";
import ResumeNoExperience from "./components/blog/ResumeNoExperience";
import ProfessionalSummaryExamples from "./components/blog/ProfessionalSummaryExamples";
import EnvironmentBanner from "./components/EnvironmentBanner";
import { EditorProvider, useEditorContext } from "./contexts/EditorContext";
import ResumeKeywordsGuide from "./components/blog/ResumeKeywordsGuide";
import CoverLetterGuide from "./components/blog/CoverLetterGuide";
import RemoteWorkResume from "./components/blog/RemoteWorkResume";
import ResumeLengthGuide from "./components/blog/ResumeLengthGuide";
import TechResumeGuide from "./components/blog/TechResumeGuide";
import ResumeVsCvDifference from "./components/blog/ResumeVsCvDifference";
import AIResumeBuilder from "./components/blog/AIResumeBuilder";

function AppContent() {
  const location = useLocation();
  const isEditorPage = location.pathname === "/editor";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <EnvironmentBanner />
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <Header />
      </header>

      {/* Main Content */}
      <main
        className={`flex-grow ${
          isEditorPage ? "px-0" : "px-4 sm:px-6 md:px-8"
        }`}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<TemplateCarousel />} />
          <Route path="/editor" element={<Editor />} />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route
            path="/blog/resume-mistakes-to-avoid"
            element={<ResumeMistakesToAvoid />}
          />
          <Route
            path="/blog/ats-resume-optimization"
            element={<ATSOptimization />}
          />
          <Route
            path="/blog/resume-no-experience"
            element={<ResumeNoExperience />}
          />
          <Route
            path="/blog/professional-summary-examples"
            element={<ProfessionalSummaryExamples />}
          />
          <Route
            path="/blog/resume-keywords-guide"
            element={<ResumeKeywordsGuide />}
          />
          <Route
            path="/blog/cover-letter-guide"
            element={<CoverLetterGuide />}
          />
          <Route
            path="/blog/remote-work-resume"
            element={<RemoteWorkResume />}
          />
          <Route
            path="/blog/resume-length-guide"
            element={<ResumeLengthGuide />}
          />
          <Route path="/blog/tech-resume-guide" element={<TechResumeGuide />} />
          <Route
            path="/blog/resume-vs-cv-difference"
            element={<ResumeVsCvDifference />}
          />
          <Route path="/blog/ai-resume-builder" element={<AIResumeBuilder />} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Error Handling */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer with integrated toolbar support */}
      <FooterWithContext isEditorPage={isEditorPage} />
    </div>
  );
}

function FooterWithContext({ isEditorPage }: { isEditorPage: boolean }) {
  if (!isEditorPage) {
    return (
      <footer className="bg-gray-100 text-gray-700 border-t shadow-sm">
        <Footer />
      </footer>
    );
  }

  const { isAtBottom } = useEditorContext();

  return (
    <footer
      className={`bg-white/95 backdrop-blur-sm text-gray-700 border-t border-gray-200 shadow-lg transition-all duration-300 ${
        isAtBottom
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      } fixed bottom-0 left-0 right-0 z-40`}
    >
      <Footer isEditorPage={true} showAboveToolbar={false} />
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <EditorProvider>
        <AppContent />
      </EditorProvider>
    </Router>
  );
}
