import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get error from URL parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  const getErrorMessage = (error) => {
    switch (error) {
      case "access_denied":
        return "Access was denied. Please try again.";
      case "server_error":
        return "Server error occurred. Please try again later.";
      case "token_creation_failed":
        return "Failed to create authentication token. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h2>
        <p className="text-gray-600 mb-6">
          {getErrorMessage(error)}
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to login page in 3 seconds...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AuthFailure;
