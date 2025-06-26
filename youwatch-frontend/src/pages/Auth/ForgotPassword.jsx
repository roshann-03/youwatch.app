import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";
import CustomToast from "@/components/custom/CustomToast";

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
    <div className="flex justify-center items-center min-h-screen dark:bg-gradient-to-br from-[#0a0f1c] via-[#0f172a] to-[#111827] dark:font-futuristic p-6">
      <div className="w-full max-w-md backdrop-blur-md border border-[#334155] dark:bg-[#0a0f1c]/70 rounded-2xl dark:shadow-[0_0_20px_#00FFF7] p-8 sm:p-10 dark:text-white">
        <h2 className="text-2xl font-bold text-center tracking-wide dark:text-cyan-300 mb-6">
          🔒 Password Recovery
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer h-12 w-full rounded-md border border-gray-900  dark:border-cyan-600 bg-transparent px-3 pt-4 dark:text-cyan-100 placeholder-transparent dark:focus:border-[#00FFF7] dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-[#00FFF7] transition-all font-mono text-lg"
              placeholder="Enter your email"
            />
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all text-sm ${
                email ? "hidden" : "top-2 text-sm dark:text-cyan-300 "
              } peer-focus:top-2 text-xl peer-focus:text-sm dark:peer-focus:text-cyan-300`}
            >
              Enter your email
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg dark:bg-gradient-to-r from-[#3A86FF] to-[#00FFF7] hover:from-[#265ef0] hover:to-[#00d4ff] transition duration-200 text-white font-semibold tracking-wide shadow-lg bg-red-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "⏳ Sending..." : "🚀 Send Reset Link"}
          </button>

          <div className="flex justify-end pt-4">
            <Link
              to="/login"
              className="text-sm dark:text-cyan-500 dark:hover:text-cyan-300 hover:text-blue-500  transition"
            >
              ⬅ Back to login
            </Link>
          </div>
        </form>

        <CustomToast />
      </div>
    </div>
  );
};

export default ForgotPassword;
