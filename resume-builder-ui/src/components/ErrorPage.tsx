import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700">
      <h1 className="text-4xl font-bold text-red-600 mb-4">HTTP 5XX</h1>
      <p className="text-lg mb-6">
        {message || "Something went wrong. Please try again later."}
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
