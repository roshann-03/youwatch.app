import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match. Please try again.");
    }

    try {
      await axiosJSON.post(`/users/reset-password/${token}`, {
        newPassword,
      });

      setMessage("✅ Password reset successful. You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4 dark:bg-gradient-to-r dark:from-[#0a0f1c] dark:to-[#111827] bg-gradient-to-br from-pink-100 to-indigo-100">
      <div className="w-full sm:w-[400px] backdrop-blur-lg bg-white/80 dark:bg-[#111827]/80 dark:border-cyan-500 border border-gray-200 dark:shadow-[0_0_30px_#00FFF7] shadow-lg rounded-2xl p-8 font-sans dark:font-futuristic">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-cyan-300 tracking-wider">
          🔐 Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-cyan-200 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-400 dark:border-cyan-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-cyan-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-cyan-200 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-gray-400 dark:border-cyan-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-cyan-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-white transition duration-200 
              bg-red-600 hover:bg-red-700 dark:bg-gradient-to-r dark:from-[#3A86FF] dark:to-[#00FFF7] 
              dark:hover:from-blue-500 dark:hover:to-cyan-400"
          >
            {message ? "Redirecting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 dark:text-green-400 text-center text-sm font-medium">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center text-sm font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
