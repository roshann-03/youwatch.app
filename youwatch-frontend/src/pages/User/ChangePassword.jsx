import { useEffect, useState } from "react";
import { axiosJSON } from "../../api/axiosInstances";
import CustomToast from "@/components/custom/CustomToast";

const ChangePassword = ({ closeModel, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      return setFormError("New password and confirm password do not match");
    }

    setLoading(true);
    try {
      const response = await axiosJSON.post("/users/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (error) {
      setFormError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#111827] bg-white p-6 rounded-xl shadow-xl border dark:border-cyan-600 dark:shadow-[0_0_20px_#00FFF7] transition-all dark:font-futuristic">
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 dark:from-cyan-400 dark:to-pink-500">
        🛡 Change Password
      </h2>

      {formError && (
        <p className="mb-4 text-center text-sm text-red-600 dark:text-red-400 font-medium">
          ⚠ {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          ["Old Password", oldPassword, setOldPassword, "oldPassword"],
          ["New Password", newPassword, setNewPassword, "newPassword"],
          [
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            "confirmPassword",
          ],
        ].map(([label, value, set, id]) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-sm font-semibold text-gray-700 dark:text-cyan-300 mb-1"
            >
              {label}
            </label>
            <input
              id={id}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-400
                dark:bg-[#1e293b] dark:text-cyan-100 dark:border-cyan-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-all"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg text-white transition-all duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 dark:shadow-[0_0_15px_#00FFF7]"
          }`}
        >
          {loading ? "Changing..." : "🔐 Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
