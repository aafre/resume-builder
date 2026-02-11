import { useNavigate } from "react-router-dom";
import SEOHead from "./SEOHead";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-chalk flex items-center justify-center px-4">
      <SEOHead title="Page Not Found | EasyFreeResume" robots="noindex, follow" />
      <div className="max-w-lg w-full">
        {/* 404 Card */}
        <div className="glass glass-hover rounded-3xl p-8 md:p-12 text-center">
          {/* 404 Code */}
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-6">
            404
          </div>

          {/* 404 Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>

          {/* 404 Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved
            or the URL might be incorrect.
          </p>

          {/* Action Buttons - No "Try Again" since it won't help for 404s */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/templates")}
                className="btn-primary flex-1 py-4 px-6"
              >
                <span className="relative z-10">Browse Templates</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="btn-secondary flex-1 py-4 px-6"
              >
                Go Home
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            Looking for templates? Start building your resume from our homepage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
