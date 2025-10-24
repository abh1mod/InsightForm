import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages on page if needed
  const [sendingEmail, setSendingEmail] = useState(false); // Using 'sendingEmail' state like original

  // Email validation regex from original Login.jsx
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Handles form submission, replicating the logic from the
   * original handlePasswordReset function in Login.jsx.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSendingEmail(true); // Set loading state (using original state name)
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages

    // Validation exactly like original handlePasswordReset
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSendingEmail(false);
      return;
    }

    console.log("AXIOS OBJECT:", axios); // Add this line
    try {
      // API call exactly like original handlePasswordReset
      // Using '/auth/forget-password' endpoint from original Login.jsx
      const res = await axios.post("http://localhost:3000/api/auth/forget-password", { // Add http://localhost:3000/api
      email: email,
      });

      // Success handling exactly like original handlePasswordReset
      if (res.data.success) {
        toast.success(res.data.message || "Password reset email sent!");
        setMessage(res.data.message || "Password reset email sent!"); // Optional: show message on page too
        setEmail(""); // Clear input on success
      } else {
        // Handle cases where API responds success:false
        throw new Error(res.data.message || "Failed to send reset email.");
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
