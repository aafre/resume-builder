import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

// Critical components - loaded immediately
import Header from "./components/Header";
import Footer from "./components/Footer";
import EnvironmentBanner from "./components/EnvironmentBanner";
import AnnouncementBar from "./components/AnnouncementBar";
import ScrollToTop from "./components/ScrollToTop";
import { EditorProvider } from "./contexts/EditorContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SideRailLayout, InContentAd, AD_CONFIG, isExplicitAdsEnabled } from "./components/ads";
import { ConversionProvider } from "./contexts/ConversionContext";
import usePreferencePersistence from "./hooks/usePreferencePersistence";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Landing page — inlined (6.5 KB brotli) to avoid Suspense fallback → page
// transition that causes massive CLS on mobile (footer shifts twice)
import LandingPage from "./components/LandingPage";

// Dev tools — lazy-loaded so they don't add to the main bundle
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools }))
);

// Prefetch keyword page chunks on matching routes — starts network
// fetch in parallel with React initialization, eliminating waterfall
if (window.location.pathname.startsWith('/resume-keywords')) {
  import('./components/seo/JobKeywordsPage');
  import('./components/seo/ResumeKeywordsHub');
  import('./components/seo/CustomerServiceKeywords');
}

// Lazy-loaded route components
const TemplatesPage = lazy(() => import("./components/seo/TemplatesPage"));
const Editor = lazy(() => import("./components/Editor"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const AuthCallback = lazy(() => import("./components/AuthCallback"));

// SEO landing pages - lazy loaded
const ActualFreeResumeBuilder = lazy(() => import("./components/seo/ActualFreeResumeBuilder"));
const FreeResumeBuilderNoSignUp = lazy(() => import("./components/seo/FreeResumeBuilderNoSignUp"));
const TemplatesHub = lazy(() => import("./components/seo/TemplatesHub"));
const AtsFriendlyTemplate = lazy(() => import("./components/seo/AtsFriendlyTemplate"));
const ResumeKeywordsHub = lazy(() => import("./components/seo/ResumeKeywordsHub"));
const CustomerServiceKeywords = lazy(() => import("./components/seo/CustomerServiceKeywords"));
const JobKeywordsPage = lazy(() => import("./components/seo/JobKeywordsPage"));
const BestFreeResumeBuilderReddit = lazy(() => import("./components/seo/BestFreeResumeBuilderReddit"));
const FreeCVBuilder = lazy(() => import("./components/seo/FreeCVBuilder"));
const CVTemplatesHub = lazy(() => import("./components/seo/CVTemplatesHub"));
const CVTemplatesPage = lazy(() => import("./components/seo/CVTemplatesPage"));
const ModernTemplatesPage = lazy(() => import("./components/seo/ModernTemplatesPage"));
const MinimalistTemplatesPage = lazy(() => import("./components/seo/MinimalistTemplatesPage"));
const StudentTemplatesPage = lazy(() => import("./components/seo/StudentTemplatesPage"));

// Job Examples (pSEO)
const JobExamplesHub = lazy(() => import("./components/seo/JobExamplesHub"));
const JobExamplePage = lazy(() => import("./components/seo/JobExamplePage"));
const JobsPage = lazy(() => import("./components/JobsPage"));

// Jobs pSEO hydration pages
const JobsLandingPage = lazy(() => import("./components/jobs/JobsLandingPage"));
const JobsRoleHub = lazy(() => import("./components/jobs/JobsRoleHub"));

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
// SoftwareEngineerResumeKeywords removed - route now redirects to /resume-keywords/software-engineer
const EasyFreeResumeFreeBlog = lazy(() => import("./components/blog/EasyFreeResumeFreeBlog"));
const ZetyVsEasyFreeResume = lazy(() => import("./components/blog/ZetyVsEasyFreeResume"));
const HowToListSkills = lazy(() => import("./components/blog/HowToListSkills"));
const QuantifyResumeAccomplishments = lazy(() => import("./components/blog/QuantifyResumeAccomplishments"));

// New AI blog posts
const ChatGPTResumePrompts = lazy(() => import("./components/blog/ChatGPTResumePrompts"));
const AIResumeWritingGuide = lazy(() => import("./components/blog/AIResumeWritingGuide"));
const ClaudeResumePrompts = lazy(() => import("./components/blog/ClaudeResumePrompts"));
const GeminiResumePrompts = lazy(() => import("./components/blog/GeminiResumePrompts"));
const GrokResumePrompts = lazy(() => import("./components/blog/GrokResumePrompts"));
const AIJobDescriptionAnalyzer = lazy(() => import("./components/blog/AIJobDescriptionAnalyzer"));
const AIResumeReview = lazy(() => import("./components/blog/AIResumeReview"));

// Competitor comparison blog posts
const ResumeIOVsEasyFreeResume = lazy(() => import("./components/blog/ResumeIOVsEasyFreeResume"));
const ResumeGeniusVsEasyFreeResume = lazy(() => import("./components/blog/ResumeGeniusVsEasyFreeResume"));
const NovoResumeVsEasyFreeResume = lazy(() => import("./components/blog/NovoResumeVsEasyFreeResume"));
const EnhancvVsEasyFreeResume = lazy(() => import("./components/blog/EnhancvVsEasyFreeResume"));
const CanvaVsEasyFreeResume = lazy(() => import("./components/blog/CanvaVsEasyFreeResume"));
const FlowCVVsEasyFreeResume = lazy(() => import("./components/blog/FlowCVVsEasyFreeResume"));

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

const SEOPageSkeleton = () => (
  <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8fafc, rgba(219,234,254,0.3), rgba(199,210,254,0.4))' }}>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <div className="h-5 w-48 bg-gray-200 rounded-md mb-8"></div>
        {/* Hero H1 */}
        <div className="h-12 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
        {/* Subtitle */}
        <div className="h-6 w-2/3 bg-gray-200 rounded-md mb-8"></div>
        {/* CTA buttons */}
        <div className="flex gap-4 mb-12">
          <div className="h-14 w-40 bg-gray-200 rounded-xl"></div>
          <div className="h-14 w-40 bg-gray-200 rounded-xl"></div>
        </div>
        {/* Content sections */}
        <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
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
      <AnnouncementBar />
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
        <SideRailLayout enabled={!isEditorPage}>
        <Routes>
          {/* Landing page — inlined to eliminate Suspense CLS */}
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
                <TemplatesPage />
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
              <Suspense fallback={<SEOPageSkeleton />}>
                <ResumeKeywordsHub />
              </Suspense>
            }
          />
          <Route
            path="/resume-keywords/customer-service"
            element={
              <Suspense fallback={<SEOPageSkeleton />}>
                <CustomerServiceKeywords />
              </Suspense>
            }
          />
          {/* Dynamic route for programmatic SEO job keywords pages */}
          <Route
            path="/resume-keywords/:jobSlug"
            element={
              <Suspense fallback={<SEOPageSkeleton />}>
                <JobKeywordsPage />
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
          <Route
            path="/free-cv-builder-no-sign-up"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <FreeCVBuilder />
              </Suspense>
            }
          />
          <Route
            path="/cv-templates/ats-friendly"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CVTemplatesHub />
              </Suspense>
            }
          />
          <Route
            path="/cv-templates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CVTemplatesPage />
              </Suspense>
            }
          />

          {/* Template Style Landing Pages */}
          <Route
            path="/templates/modern-resume-templates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ModernTemplatesPage />
              </Suspense>
            }
          />
          <Route
            path="/templates/minimalist-resume-templates"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MinimalistTemplatesPage />
              </Suspense>
            }
          />
          <Route
            path="/templates/resume-templates-for-students"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <StudentTemplatesPage />
              </Suspense>
            }
          />

          {/* Jobs Page */}
          <Route
            path="/jobs"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsPage />
              </Suspense>
            }
          />

          {/* Jobs pSEO Pages */}
          <Route
            path="/jobs/in/:locationSlug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsLandingPage />
              </Suspense>
            }
          />
          <Route
            path="/jobs/:roleSlug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsRoleHub />
              </Suspense>
            }
          />
          <Route
            path="/jobs/:roleSlug/:locationSlug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsLandingPage />
              </Suspense>
            }
          />
          <Route
            path="/jobs/:roleSlug/:locationSlug/:modifier"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsLandingPage />
              </Suspense>
            }
          />
          <Route
            path="/jobs/:seniority/:roleSlug/:locationSlug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobsLandingPage />
              </Suspense>
            }
          />

          {/* Job Examples (pSEO) */}
          <Route
            path="/examples"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobExamplesHub />
              </Suspense>
            }
          />
          <Route
            path="/examples/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <JobExamplePage />
              </Suspense>
            }
          />

          {/* Auth callback route - must be before catch-all */}
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AuthCallback />
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
            path="/editor"
            element={<Navigate to="/templates" replace />}
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
          {/* Client-side redirect fallbacks — server-side 301s in app.py are primary */}
          {[
            { from: "/blog/software-engineer-resume-keywords", to: "/resume-keywords/software-engineer" },
            { from: "/blog/customer-service-resume-keywords", to: "/resume-keywords/customer-service" },
            { from: "/blog/how-to-use-resume-keywords-to-beat-ats", to: "/blog/how-to-use-resume-keywords" },
            { from: "/blog/how-to-list-skills-on-resume", to: "/blog/how-to-list-skills" },
            { from: "/blog/career-change-resume", to: "/blog" },
            { from: "/privacy", to: "/privacy-policy" },
            { from: "/terms", to: "/terms-of-service" },
          ].map(({ from, to }) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
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

          {/* New AI Blog Posts */}
          <Route
            path="/blog/chatgpt-resume-prompts"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ChatGPTResumePrompts />
              </Suspense>
            }
          />
          <Route
            path="/blog/ai-resume-writing-guide"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <AIResumeWritingGuide />
              </Suspense>
            }
          />
          <Route
            path="/blog/claude-resume-prompts"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ClaudeResumePrompts />
              </Suspense>
            }
          />
          <Route
            path="/blog/gemini-resume-prompts"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <GeminiResumePrompts />
              </Suspense>
            }
          />
          <Route
            path="/blog/grok-resume-prompts"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <GrokResumePrompts />
              </Suspense>
            }
          />
          <Route
            path="/blog/ai-job-description-analyzer"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <AIJobDescriptionAnalyzer />
              </Suspense>
            }
          />
          <Route
            path="/blog/ai-resume-review"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <AIResumeReview />
              </Suspense>
            }
          />

          {/* Competitor Comparison Blog Posts */}
          <Route
            path="/blog/resume-io-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeIOVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/resume-genius-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <ResumeGeniusVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/novoresume-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <NovoResumeVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/enhancv-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <EnhancvVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/canva-resume-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <CanvaVsEasyFreeResume />
              </Suspense>
            }
          />
          <Route
            path="/blog/flowcv-vs-easy-free-resume"
            element={
              <Suspense fallback={<BlogLoadingSkeleton />}>
                <FlowCVVsEasyFreeResume />
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
        </SideRailLayout>
      </main>

      {/* Above-footer ad — all non-editor pages (only when explicit ads enabled) */}
      {!isEditorPage && (isExplicitAdsEnabled() || AD_CONFIG.debug) && (
        <div className="container mx-auto max-w-4xl px-4">
          <InContentAd adSlot={AD_CONFIG.slots.aboveFooter} marginY={32} />
        </div>
      )}

      {/* Footer - Always visible, static positioning */}
      <footer id="app-footer" className="bg-gray-100 text-gray-700 border-t shadow-sm mt-auto">
        <Footer />
      </footer>
    </div>
  </>
  );
}

// Wrapper component to access auth context and provide preferences to ConversionProvider
function AppWithProviders() {
  const { session, loading: authLoading } = useAuth();

  const { preferences, setPreference } = usePreferencePersistence({
    session,
    authLoading
  });

  return (
    <ConversionProvider
      idleNudgeShown={preferences.idle_nudge_shown}
      setIdleNudgeShown={(value) => setPreference('idle_nudge_shown', value)}
    >
      <QueryClientProvider client={queryClient}>
        <EditorProvider>
          <AppContent />
          <Toaster
            position="top-right"
            containerStyle={{
              zIndex: 10001,
            }}
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
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </QueryClientProvider>
    </ConversionProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithProviders />
      </AuthProvider>
    </Router>
  );
}
