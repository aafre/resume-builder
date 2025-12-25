import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

// Critical components - loaded immediately
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import EnvironmentBanner from "./components/EnvironmentBanner";
import ScrollToTop from "./components/ScrollToTop";
import { EditorProvider, useEditorContext } from "./contexts/EditorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ConversionProvider } from "./contexts/ConversionContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Lazy-loaded route components
const TemplateCarousel = lazy(() => import("./components/TemplateCarousel"));
const Editor = lazy(() => import("./components/Editor"));
const MyResumes = lazy(() => import("./pages/MyResumes"));

// SEO landing pages - lazy loaded
const ActualFreeResumeBuilder = lazy(() => import("./components/seo/ActualFreeResumeBuilder"));
const FreeResumeBuilderNoSignUp = lazy(() => import("./components/seo/FreeResumeBuilderNoSignUp"));
const TemplatesHub = lazy(() => import("./components/seo/TemplatesHub"));
const AtsFriendlyTemplate = lazy(() => import("./components/seo/AtsFriendlyTemplate"));
const ResumeKeywordsHub = lazy(() => import("./components/seo/ResumeKeywordsHub"));
const CustomerServiceKeywords = lazy(() => import("./components/seo/CustomerServiceKeywords"));
const BestFreeResumeBuilderReddit = lazy(() => import("./components/seo/BestFreeResumeBuilderReddit"));

// Static pages - lazy loaded
const AboutUs = lazy(() => import("./components/AboutUs"));
const Contact = lazy(() => import("./components/Contact"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));

// Blog components - lazy loaded
const BlogIndex = lazy(() => import("./components/BlogIndex"));
const ResumeMistakesToAvoid = lazy(() => import("./components/blog/ResumeMistakesToAvoid"));
const ATSOptimization = lazy(() => import("./components/blog/ATSOptimization"));
const ResumeNoExperience = lazy(() => import("./components/blog/ResumeNoExperience"));
const ProfessionalSummaryExamples = lazy(() => import("./components/blog/ProfessionalSummaryExamples"));
const ResumeKeywordsGuide = lazy(() => import("./components/blog/ResumeKeywordsGuide"));
const CoverLetterGuide = lazy(() => import("./components/blog/CoverLetterGuide"));
const RemoteWorkResume = lazy(() => import("./components/blog/RemoteWorkResume"));
const ResumeLengthGuide = lazy(() => import("./components/blog/ResumeLengthGuide"));
const TechResumeGuide = lazy(() => import("./components/blog/TechResumeGuide"));
const ResumeVsCvDifference = lazy(() => import("./components/blog/ResumeVsCvDifference"));
const AIResumeBuilder = lazy(() => import("./components/blog/AIResumeBuilder"));
const JobInterviewGuide = lazy(() => import("./components/blog/JobInterviewGuide"));
const BehavioralInterviewQuestions = lazy(() => import("./components/blog/BehavioralInterviewQuestions"));
const IntroducingPrepAI = lazy(() => import("./components/blog/IntroducingPrepAI"));
const HowToWriteResumeGuide = lazy(() => import("./components/blog/HowToWriteResumeGuide"));
const ResumeActionVerbs = lazy(() => import("./components/blog/ResumeActionVerbs"));
const HowToUseResumeKeywords = lazy(() => import("./components/blog/HowToUseResumeKeywords"));
const SoftwareEngineerResumeKeywords = lazy(() => import("./components/blog/SoftwareEngineerResumeKeywords"));
const CustomerServiceResumeKeywords = lazy(() => import("./components/blog/CustomerServiceResumeKeywords"));
const EasyFreeResumeFreeBlog = lazy(() => import("./components/blog/EasyFreeResumeFreeBlog"));
const ZetyVsEasyFreeResume = lazy(() => import("./components/blog/ZetyVsEasyFreeResume"));
const HowToListSkills = lazy(() => import("./components/blog/HowToListSkills"));
const QuantifyResumeAccomplishments = lazy(() => import("./components/blog/QuantifyResumeAccomplishments"));

// Error pages - lazy loaded
const NotFound = lazy(() => import("./components/NotFound"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

// Loading components for different contexts
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const BlogLoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-md mb-8 w-1/2"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
      </div>
    </div>
  </div>
);

const EditorLoadingSkeleton = () => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Resume Editor...</p>
    </div>
  </div>
);


function AppContent() {
  const location = useLocation();
  const isEditorPage = location.pathname.startsWith("/editor");

  return (
  <>
   <ScrollToTop/>
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
          {/* Critical route - no lazy loading */}
          <Route path="/" element={<LandingPage />} />

          {/* SEO Landing Pages */}
          <Route
            path="/actual-free-resume-builder"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ActualFreeResumeBuilder />
              </Suspense>
            }
          />
          <Route
            path="/free-resume-builder-no-sign-up"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <FreeResumeBuilderNoSignUp />
              </Suspense>
            }
          />
          <Route
            path="/templates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TemplateCarousel />
              </Suspense>
            }
          />
          <Route
            path="/ats-resume-templates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TemplatesHub />
              </Suspense>
            }
          />
          <Route
            path="/templates/ats-friendly"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AtsFriendlyTemplate />
              </Suspense>
            }
          />
          <Route
            path="/resume-keywords"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ResumeKeywordsHub />
              </Suspense>
            }
          />
          <Route
            path="/resume-keywords/customer-service"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CustomerServiceKeywords />
              </Suspense>
            }
          />
          <Route
            path="/best-free-resume-builder-reddit"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BestFreeResumeBuilderReddit />
              </Suspense>
            }
          />

          {/* High-priority routes with appropriate loading states */}
          <Route
            path="/editor/:resumeId"
            element={
              <Suspense fallback={<EditorLoadingSkeleton />}>
                <Editor />
              </Suspense>
            }
          />
          <Route
            path="/my-resumes"
            element={
              <Suspense fallback={<EditorLoadingSkeleton />}>
                <MyResumes />
              </Suspense>
            }
          />

          {/* Blog Routes - lazy loaded with blog skeleton */}
          <Route 
            path="/blog" 
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <BlogIndex />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-mistakes-to-avoid"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeMistakesToAvoid />
              </Suspense>
            }
          />
          <Route
            path="/blog/ats-resume-optimization"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ATSOptimization />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-no-experience"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeNoExperience />
              </Suspense>
            }
          />
          <Route
            path="/blog/professional-summary-examples"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ProfessionalSummaryExamples />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-keywords-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeKeywordsGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/cover-letter-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <CoverLetterGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/remote-work-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <RemoteWorkResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-length-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeLengthGuide />
              </Suspense>
            }
          />
          <Route 
            path="/blog/tech-resume-guide" 
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <TechResumeGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-vs-cv-difference"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeVsCvDifference />
              </Suspense>
            }
          />
          <Route 
            path="/blog/ai-resume-builder" 
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <AIResumeBuilder />
              </Suspense>
            }
          />

          {/* New blog routes */}
          <Route
            path="/blog/job-interview-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <JobInterviewGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/behavioral-interview-questions"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <BehavioralInterviewQuestions />
              </Suspense>
            }
          />
          <Route
            path="/blog/introducing-prepai-ai-interview-coach"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <IntroducingPrepAI />
              </Suspense>
            }
          />
          <Route
            path="/blog/how-to-write-a-resume-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <HowToWriteResumeGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-action-verbs"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeActionVerbs />
              </Suspense>
            }
          />
          <Route
            path="/blog/how-to-use-resume-keywords"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <HowToUseResumeKeywords />
              </Suspense>
            }
          />
          <Route
            path="/blog/software-engineer-resume-keywords"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <SoftwareEngineerResumeKeywords />
              </Suspense>
            }
          />
          <Route
            path="/blog/customer-service-resume-keywords"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <CustomerServiceResumeKeywords />
              </Suspense>
            }
          />
          <Route
            path="/blog/how-why-easyfreeresume-completely-free"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <EasyFreeResumeFreeBlog />
              </Suspense>
            }
          />
          <Route
            path="/blog/zety-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ZetyVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/how-to-list-skills"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <HowToListSkills />
              </Suspense>
            }
          />
          <Route
            path="/blog/quantify-resume-accomplishments"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <QuantifyResumeAccomplishments />
              </Suspense>
            }
          />

          {/* Static Pages - lazy loaded */}
          <Route 
            path="/about" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AboutUs />
              </Suspense>
            }
          />
          <Route 
            path="/contact" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Contact />
              </Suspense>
            }
          />
          <Route 
            path="/privacy-policy" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route 
            path="/terms-of-service" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TermsOfService />
              </Suspense>
            }
          />

          {/* Error Handling - lazy loaded */}
          <Route 
            path="/error" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ErrorPage />
              </Suspense>
            }
          />
          <Route 
            path="*" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </main>

      {/* Footer with integrated toolbar support */}
      <FooterWithContext isEditorPage={isEditorPage} />
    </div>
  </>
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
      <AuthProvider>
        <ConversionProvider>
          <QueryClientProvider client={queryClient}>
            <EditorProvider>
              <AppContent />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </EditorProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ConversionProvider>
      </AuthProvider>
    </Router>
  );
}
