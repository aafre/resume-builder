import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import TemplateCarousel from "./components/TemplateCarousel";
import Editor from "./components/Editor";
import NotFound from "./components/NotFound";
import ErrorPage from "./components/ErrorPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import EnvironmentBanner from "./components/EnvironmentBanner";
import { EditorProvider, useEditorContext } from "./contexts/EditorContext";

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
      <main className={`flex-grow ${isEditorPage ? 'px-0' : 'px-4 sm:px-6 md:px-8'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<TemplateCarousel />} />
          <Route path="/editor" element={<Editor />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFound />} />

          {/* Redirect to ErrorPage for any specific server-side error */}
          <Route path="/error" element={<ErrorPage />} />
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
    <footer className={`bg-gray-100 text-gray-700 border-t shadow-sm transition-all duration-300 ${isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'} fixed bottom-0 left-0 right-0 z-40`}>
      <Footer
        isEditorPage={true}
        showAboveToolbar={false}
      />
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
