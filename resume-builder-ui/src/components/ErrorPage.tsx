import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200 text-center">
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Again
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/templates")}
                className="flex-1 bg-white/80 backdrop-blur-sm text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
              >
                Browse Templates
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-white/80 backdrop-blur-sm text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
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
