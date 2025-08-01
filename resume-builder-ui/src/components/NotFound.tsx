import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* 404 Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200 text-center">
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse Templates
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-white/80 backdrop-blur-sm text-gray-700 py-4 px-6 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
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
