import { useNavigate } from "react-router-dom";
import SEOHead from "./SEOHead";

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/40 flex items-center justify-center px-4">
      <SEOHead title="Error | EasyFreeResume" robots="noindex, follow" />
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <div className="glass glass-hover rounded-3xl p-8 md:p-12 text-center">
          {/* Error Code */}
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-6">
            5XX
          </div>

          {/* Error Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Service Temporarily Unavailable
          </h1>

          {/* Error Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {message ||
              "We're experiencing technical difficulties. Please try again in a few moments."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRefresh}
              className="btn-primary w-full py-4 px-6"
            >
              <span className="relative z-10">Try Again</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/templates")}
                className="btn-secondary flex-1 py-3 px-4"
              >
                Browse Templates
              </button>
              <button
                onClick={() => navigate("/")}
                className="btn-secondary flex-1 py-3 px-4"
              >
                Go Home
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            If this keeps happening, try refreshing the page or check your
            internet connection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
