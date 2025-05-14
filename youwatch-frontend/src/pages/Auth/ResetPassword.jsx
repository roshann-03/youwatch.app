import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match. Please try again.");
    }

    try {
      await axiosJSON.post(`/users/reset-password/${token}`, {
        newPassword,
      });

      setMessage("Password reset successful. You can now log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900   bg-gradient-to-r from-rose-500 to-purple-500 px-4">
      <div className="w-full sm:w-96 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-800 text-center dark:text-gray-300 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium dark:text-gray-200 ">
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 p-3  dark:text-gray-200 border border-gray-500 rounded-md  dark:bg-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block text-sm font-medium dark:text-gray-200  ">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 dark:text-gray-200  border border-gray-500 rounded-md dark:bg-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
