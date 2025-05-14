import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      await axiosJSON.post("/users/forgot-password", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
      navigate("/login", {
        state: { message: "Reset link sent to your email" },
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4">
      <div className="w-full max-w-md dark:bg-gray-950 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center dark:text-white mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer h-12 w-full rounded-md border border-gray-600 bg-transparent px-3 pt-4 text-white placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="Enter your email"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-400"
            >
              Enter your email
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 text-white font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex justify-end pt-4">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-red-400 transition"
            >
              Back to login
            </Link>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
