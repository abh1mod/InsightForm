// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../context/ContextAPI";
import axios from "axios";

import LoginComp from "../components/LoginComp";
import SignUpComp from "../components/SignUpComp";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'; // Link is needed
import { API_URL } from "../config/api.js";

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
  const [sendingEmail, setSendingEmail] = useState(false);
  // Removed sendingEmail state
  const [activeResendLink, setActiveResendLink] = useState(false);

  useEffect(()=>{
    setError('');
    setLoading(false);
    setLoginEmail("");
    setLoginPassword("");
    setUsername("");
    setSignUpEmail("");
    setSignUpPassword("");
    setActiveResendLink(false);
  },[showSignup])
  // Removed emailRegex

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }

    // Check for error messages from URL parameters
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setError("Authentication failed. Please try again.");
    }
  }, [isLoggedIn, navigate]);

  // handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username: loginEmail, // Passport local expects username
        password : loginPassword,
      });
      if (res.data.token) {
        toast.success(res.data.message || "Login successful!");
        login(res.data.token); // Save token in context + localStorage
        navigate("/dashboard");
      }
    } catch (err) {
      if(err.response?.data?.message === "Email not verified"){
        console.log("YES");
        setActiveResendLink(true);
      }
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  // handleSignUp 
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        name: username,
        email: signupEmail,
        password: signupPassword,
      });

      if (res.data.success) {
        console.log(res)
        toast.success(res.data.message || "Signup successful! Please verify your email before logging in.");
        setActiveResendLink(true);
      }
    } catch (err) {
        if(err.response?.data?.message === "Error sending verification email"){
          setActiveResendLink(true);
        }
        console.log(err);
        
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed!");
    } finally {
      // setActiveResendLink(true);
      setLoading(false);
    }
  };

  // handleGoogleLogin remains EXACTLY as provided by the user
  const handleGoogleLogin = () => {
    const frontendOrigin = window.location.origin;
    window.location.href = `${API_URL}/api/auth/google?origin=${encodeURIComponent(frontendOrigin)}`;
  };



  return (
    <div className="flex min-[80vh] items-center justify-center">
      <div className="flex mt-12 mb-12 flex-col bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {showSignup ? "Sign Up" : "Log In"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg"> {/* Adjusted bg/border */}
            <p className="text-red-600 text-sm text-center">{error}</p> {/* Adjusted alignment */}
          </div>
        )}

        {!showSignup && <>
          <LoginComp
            email = {loginEmail}
            password = {loginPassword}
            setEmail = {setLoginEmail}
            setPassword = {setLoginPassword}
            onFormSubmit = {handleLogin}
            loading = {loading}
          />
          {/* --- MINIMAL CHANGE HERE --- */}
          <div className="mt-4 text-center"> {/* Consistent spacing */}
            <Link
              to="/forgot-password" // Changed from button to Link
              // Used original button's styling classes where applicable
              className="text-sm text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
            >
              Forgot your password?
            </Link>
          </div>
          {/* --- END OF MINIMAL CHANGE --- */}
                      {activeResendLink &&
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={()=>navigate("/resend-verification")}
                // disabled={sendingEmail} // Disable if adding separate loading state
                className="text-sm bg-transparent border-none text-gray-600 hover:underline hover:text-blue-600 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend Confirmation Link
              </button>
            </div>}
        </>}

        {showSignup && <>
          <SignUpComp
            name = {username}
            email = {signupEmail}
            password = {signupPassword}
            setName = {setUsername}
            setEmail = {setSignUpEmail}
            setPassword = {setSignUpPassword}
            onFormSubmit = {handleSignUp}
            loading = {loading}
          />
          {/* --- REMOVED Validation Messages from here --- */}

          {activeResendLink &&
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={()=>navigate("/resend-verification")}
                // disabled={sendingEmail} // Disable if adding separate loading state
                className="text-sm bg-transparent border-none text-gray-600 hover:underline hover:text-blue-600 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend Confirmation Link
              </button>
            </div>}
        </>}


        <div className="mt-6">
          <div className="my-6 flex items-center justify-center text-gray-500"> {/* Adjusted my */}
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink px-2 bg-white text-sm">Or continue with</span> {/* Adjusted px */}
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button - Unchanged */}
          <button
            onClick={handleGoogleLogin} // Kept original function call
            type="button" // Important for buttons not submitting forms
            className="w-full mt-4 flex items-center justify-center bg-white border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm" // Adjusted styling slightly for consistency
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"> {/* Adjusted SVG viewbox */}
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google {/* Changed text slightly */}
          </button>

          {/* Toggle Link - Unchanged */}
          <p
            onClick={() => { setShowSignup(!showSignup); }}
            className="text-sm text-gray-600 text-center mt-6 hover:underline hover:text-blue-600 cursor-pointer" // Adjusted mt
          >
            {showSignup ? "Already have an account? Log In" : "Don't have an Account? Sign Up"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;