import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return toast.error("Please fill in all fields");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      const response = await axiosJSON.post("/users/set-password", {
        userId,
        password,
      });
      if (response.status === 200) {
        login();
        toast.success("Password set successfully");
        navigate("/", {
          state: { message: "Password set successfully" },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4">
      <div className="w-full max-w-md dark:bg-gray-950 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center dark:text-white mb-6">
          Set a Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer h-12 w-full rounded-md border border-gray-600 bg-transparent px-3 pt-4 text-black dark:text-white placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="New Password"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-400"
            >
              Set Password
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="peer h-12 w-full rounded-md border border-gray-600 bg-transparent px-3 pt-4 text-black dark:text-white placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="Confirm Password"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-3 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-400"
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 text-white font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Set Password"}
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default SetPassword;
