// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../context/ContextAPI";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginComp from "../components/LoginComp";
import SignUpComp from "../components/SignUpComp";
import { toast } from 'react-toastify';



const Login = () => {
  const { login, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [username, setUsername] = useState("");
  const [signupEmail, setSignUpEmail] = useState("");
  const [signupPassword, setSignUpPassword] = useState("")

  const [showSignup, setShowSignup] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [activeResendLink, setActiveResendLink] = useState(false);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username: loginEmail, // Passport local expects username
        password : loginPassword,
      });
      if (res.data.token) {
        toast.success(res.data.message || "Login successful!");
        login(res.data.token); // Save token in context + localStorage
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

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
        toast.success(res.data.message || "Signup successful! Please verify your email before logging in.");
        setActiveResendLink(true);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  // handle Google login
  const handleGoogleLogin = () => {
    // open backend Google OAuth flow
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handlePasswordReset = async () =>{
    setSendingEmail(true);
    setError("");
    if (!emailRegex.test(loginEmail)) {
      setError("Please enter a valid email address.");
      setSendingEmail(false);
      return;
    }
      try{
        const res = await axios.post("http://localhost:3000/api/auth/forget-password", {
          email: loginEmail,
        });
        if(res.data.success){
          toast.success(res.data.message || "Password reset email sent!");
        }
      }catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Error sending password reset email.");
      }
      setSendingEmail(false);
  }

const handleResendVerification = async () =>{
    setSendingEmail(true);
    setError("");
    if (!emailRegex.test(signupEmail)) {
      setError("Please enter a valid email address.");
      setSendingEmail(false);
      return;
    }
      try{
        const res = await axios.post("http://localhost:3000/api/auth/resend-verification",{
          email : signupEmail
        });
        if(res.data.success){
          toast.success(res.data.message || "Verification email resent!");
        }
      }catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Error resending verification email.");
      }
      setSendingEmail(false);
  }

  return (
    <div className="flex min-[80vh] items-center justify-center">
      <div className="flex mt-12 flex-col bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {showSignup === true ? "Sign Up" : "Log In"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
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
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={sendingEmail}
          className={`text-sm text-center mt-4 bg-transparent border-none 
            ${sendingEmail
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
            }`}
        >
          Forgot your password?
        </button>
        </>  }

        {showSignup &&  <>
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
        {activeResendLink &&
          <button
          type="button"
          onClick={handleResendVerification}
          disabled={sendingEmail}
          className={`text-sm text-center mt-4 bg-transparent border-none 
            ${sendingEmail
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
            }`}
        >
          Resend Confrimation Link
        </button>}
        </> }


        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 flex items-center justify-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
             {showSignup === true ? "Sign Up" : "Log In"} with Google
          </button>
          <p 
            onClick={() => setShowSignup(!showSignup)} 
            className="text-sm text-gray-600 text-center mt-4 hover:underline hover:text-blue-600 cursor-pointer"
          >
            {showSignup ? "Already have an account?" : "Didn't have an Account?"}
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
