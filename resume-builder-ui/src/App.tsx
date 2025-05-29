import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import TemplateCarousel from "./components/TemplateCarousel";
import Editor from "./components/Editor";
import NotFound from "./components/NotFound";
import ErrorPage from "./components/ErrorPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ReviewForm from "./components/ReviewForm";
import EnvironmentBanner from "./components/EnvironmentBanner";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <EnvironmentBanner />
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <Header />
        </header>

        {/* Main Content */}
        <main className="flex-grow px-4 sm:px-6 md:px-8">
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

        {/* Footer */}
        <footer className="bg-gray-100 text-gray-700 border-t shadow-sm">
          <Footer />
        </footer>

        <ReviewForm />
      </div>
    </Router>
  );
}
