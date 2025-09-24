import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams(); // from /reset-pass/:reset-token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isPasswordValid = passwordRegex.test(password);
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || !doPasswordsMatch) return;

    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.message || "Password reset successful!");
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error resetting password.");
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Create New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          {!isPasswordValid && password.length > 0 && (
            <p className="text-sm text-red-500 mt-1">
              Must be 8+ chars, with uppercase, lowercase, digit & special char.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Enter New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />
          {confirmPassword.length > 0 && !doPasswordsMatch && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <button
          type="submit"
          disabled={!isPasswordValid || !doPasswordsMatch || loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            !isPasswordValid || !doPasswordsMatch || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
