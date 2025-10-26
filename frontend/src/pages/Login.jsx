// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../context/ContextAPI";
import axios from "axios"; 
import LoginComp from "../components/LoginComp";
import SignUpComp from "../components/SignUpComp";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [username, setUsername] = useState("");
  const [signupEmail, setSignUpEmail] = useState("");
  const [signupPassword, setSignUpPassword] = useState("");

  const [showSignup, setShowSignup] = useState(false);
  const [activeResendLink, setActiveResendLink] = useState(false);

  // useEffect 
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setError("Authentication failed. Please try again.");
    }
  }, [isLoggedIn, navigate]);

  // handleLogin 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
       const res = await axios.post("http://localhost:3000/api/auth/login", {
         username: loginEmail, 
         password: loginPassword,
       });
       if (res.data.token) {
        toast.success(res.data.message || "Login successful!");
        login(res.data.token);
        navigate("/dashboard");
      } else {
         throw new Error(res.data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.message || "Login failed!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // handleSignUp: Set activeResendLink on success
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        name : username,
        email : signupEmail,
        password : signupPassword,
      });
      if (res.data.success) {
        console.log("SignUp Successfully")
        toast.success(res.data.message || "Signup successful! Please verify your email.");
        setActiveResendLink(true); // <-- SET STATE HERE ON SUCCESS
        setShowSignup(false); // Switch back to login view
        // Clear fields after success
        setUsername('');
        // Keep signupEmail temporarily if needed for resend, or clear if Resend page handles input separately
        // setSignUpEmail(''); // Decide if you want to clear this
        setSignUpPassword('');
      } else {
        throw new Error(res.data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.message || "Signup failed!";
      setError(msg);
      toast.error(msg);
      setActiveResendLink(false); // Ensure it's false on error
    } finally {
      setLoading(false);
    }
  };

  // handleGoogleLogin 
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {showSignup ? "Sign Up" : "Log In"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* --- Login Form View --- */}
        {!showSignup && <>
          <LoginComp
            email={loginEmail}
            password={loginPassword}
            setEmail={setLoginEmail}
            setPassword={setLoginPassword}
            onFormSubmit={handleLogin}
            loading={loading}
          />
          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
            >
              Forgot your password?
            </Link>
          </div>

          {/* --- Conditionally Render Resend Link HERE --- */}
          {activeResendLink && (
            <div className="mt-2 text-center"> {/* Added margin top */}
              <Link
                to="/resend-verification"
                className="text-sm text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
              >
                Didn't receive verification email? Resend.
              </Link>
            </div>
          )}
          {/* --- End Resend Link --- */}
        </>}

        {/* --- Signup Form View --- */}
        {showSignup && <>
          <SignUpComp
            name={username}
            email={signupEmail}
            password={signupPassword}
            setName={setUsername}
            setEmail={setSignUpEmail} // Pass setter down
            setPassword={setSignUpPassword}
            onFormSubmit={handleSignUp}
            loading={loading}
          />
          {/* --- Resend Link/Button REMOVED from here --- */}
        </>}

        {/* --- Separator & Google Login --- */}
        <div className="mt-6">
           <div className="my-6 flex items-center justify-center text-gray-500">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink px-4 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-150 shadow-sm"
            disabled={loading}
          >
             <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h13.01c-.57 2.83-2.31 5.17-4.79 6.81l7.73 6c4.53-4.18 7.24-10.45 7.24-17.77z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Continue with Google
          </button>

          {/* Toggle between Login and Signup */}
          <p
            onClick={() => {
              setShowSignup(!showSignup);
              setError('');
              setActiveResendLink(false); // <-- Reset state on toggle
            }}
            className="text-sm text-gray-600 text-center mt-6 hover:underline hover:text-blue-600 cursor-pointer"
          >
            {showSignup ? "Already have an account? Log In" : "Didn't have an Account? Sign Up"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;