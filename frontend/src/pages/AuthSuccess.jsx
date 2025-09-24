import { useEffect } from "react";
import { useAppContext } from "../context/ContextAPI";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    if (token) {
      // Save the token and redirect to dashboard
      login(token);
      navigate("/dashboard", { replace: true });
    } else {
      // No token found, redirect to login with error
      navigate("/login?error=no_token", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
