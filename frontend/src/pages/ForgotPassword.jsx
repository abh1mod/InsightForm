import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config/api.js";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false); // Using 'sendingEmail' state like original

  // Email validation regex from original Login.jsx
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSendingEmail(true); // Set loading state (using original state name)
    setError(""); // Clear previous errors
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSendingEmail(false);
      return;
    }

    try {
      // Using '/auth/forgot-password' endpoint from Login.jsx
      // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      if (res.data.success) {
        toast.success(res.data.message || "Password reset email sent!");
        setEmail(""); // Clear input on success
      } 
    } catch (err) {
      // Error handling exactly like original handlePasswordReset
      console.error(err.response?.data || err.message); // Log the detailed error
      const errMsg =
        err.response?.data?.message || "Error sending password reset email.";
      setError(errMsg); // Set error state for display on page
      toast.error(errMsg); // Show toast notification
    } finally {
      // Reset loading state exactly like original handlePasswordReset
      setSendingEmail(false);
    }
  };
  
  return (
    // Outer container - Centered layout matching Login.jsx
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Central card - Styling matches Login.jsx */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your user account's verified email address and we will send you
          a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // Input styling matches LoginComp.jsx/SignUpComp.jsx
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 placeholder-gray-500 shadow-sm appearance-none"
              placeholder="Enter your email address"
              disabled={sendingEmail} // Disable input while sending
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            // Button styling matches LoginComp.jsx/SignUpComp.jsx
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={sendingEmail} // Disable button while sending
          >
            {sendingEmail ? "Sending..." : "Send Password Reset Email"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
