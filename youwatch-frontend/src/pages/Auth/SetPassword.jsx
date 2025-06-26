import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";
import CustomToast from "@/components/custom/CustomToast";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return setFormError("Please fill in all fields");
    if (password !== confirmPassword)
      return setFormError("Passwords do not match");

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user.username;

      const response = await axiosJSON.post("/users/set-password", {
        username,
        password,
      });

      if (response.status === 200) {
        login();
        window.toast.success("🔐 Password set successfully");
        navigate("/", {
          state: { message: "Password set successfully" },
        });
      }
    } catch (error) {
      console.error(error);
      setFormError(
        error?.response?.data?.message || "❌ Failed to set password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0a0f1c] dark:to-[#111827]">
      <div className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-[#111827]/80 border border-gray-300 dark:border-cyan-500 rounded-2xl shadow-xl dark:shadow-[0_0_30px_#00FFF7] p-8 font-sans dark:font-futuristic transition-all">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-cyan-300 tracking-wider mb-6">
          🔐 Set Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New Password"
              className="peer h-12 w-full rounded-md border border-gray-400 dark:border-cyan-600 bg-transparent px-3 pt-4 text-gray-800 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-cyan-400 transition-all"
            />
            <label
              htmlFor="password"
              className={`absolute left-3 top-2 text-sm text-gray-500 dark:text-cyan-400 transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm 
                peer-focus:text-red-500 dark:peer-focus:text-cyan-300`}
            >
              New Password
            </label>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
              className="peer h-12 w-full rounded-md border border-gray-400 dark:border-cyan-600 bg-transparent px-3 pt-4 text-gray-800 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-cyan-400 transition-all"
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-3 top-2 text-sm text-gray-500 dark:text-cyan-400 transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm 
                peer-focus:text-red-500 dark:peer-focus:text-cyan-300`}
            >
              Confirm Password
            </label>
          </div>

          {formError && (
            <p className="text-center text-sm font-semibold text-red-600 dark:text-pink-400">
              ⚠️ {formError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white transition duration-300 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 dark:bg-gradient-to-r dark:from-[#3A86FF] dark:to-[#00FFF7] dark:hover:from-blue-600 dark:hover:to-cyan-400"
            }`}
          >
            {loading ? "Setting..." : "Set Password"}
          </button>
        <CustomToast />
        </form>

      </div>
    </div>
  );
};

export default SetPassword;
