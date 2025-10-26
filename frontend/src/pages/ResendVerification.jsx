// frontend/src/pages/Auth/ResendVerification.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"; // Using standard axios import
import { toast } from 'react-toastify';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false); // Use specific state name

  // Email validation regex (optional but good practice)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Handles form submission to resend the verification email.
   * Calls the backend's resend-verification endpoint.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setError('');
    setMessage('');

    // Optional: Frontend validation
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSendingEmail(false);
      return;
    }

    try {
      // Use the correct, full API endpoint URL
      const res = await axios.post("http://localhost:3000/api/auth/resend-verification", {
        email: email,
      });

      // Handle success
      if (res.data.success) {
        toast.success(res.data.message || "Verification email resent! Please check your inbox.");
        setMessage(res.data.message || "Verification email resent! Please check your inbox.");
        setEmail(''); // Clear input on success
      } else {
        // Handle cases where API responds success:false
        throw new Error(res.data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      // Handle errors
      console.error('Resend verification error:', err.response?.data || err.message);
      const errMsg = err.response?.data?.message || "Error resending verification email. Make sure the email is correct and hasn't been verified yet.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSendingEmail(false); // Reset loading state
    }
  };

  return (
    // Outer container - Centered layout matching Login/ForgotPassword
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Central card - Styling matches Login/ForgotPassword */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Resend Verification Email
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter the email address you used to sign up, and we'll send a new verification link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message Display */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 py-2 px-3 rounded-md">
              {error}
            </p>
          )}
          {/* Success Message Display (Optional) */}
          {message && (
            <p className="text-green-600 text-sm text-center bg-green-100 py-2 px-3 rounded-md">
              {message}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 placeholder-gray-500 shadow-sm appearance-none"
              placeholder="Enter your signup email address"
              disabled={sendingEmail}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={sendingEmail}
          >
            {sendingEmail ? "Sending..." : "Resend Verification Email"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Back to Login or Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;