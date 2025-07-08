import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";
import CustomToast from "@/components/custom/CustomToast";
import refreshToken from "@/utils/refreshToken";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      toast(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrUsername, password } = formData;

    if (!emailOrUsername || !password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosJSON.post("/users/login", formData);
      const user = response.data.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Welcome back, Commander 🤖");
      login();
      refreshToken();
      onLogin();
      navigate("/");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Invalid credentials. Try again or reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-[#0a0f1c] dark:to-[#111827] dark:font-futuristic p-4">
      <div className="w-full max-w-md backdrop-blur-md bg-white/70 dark:bg-[#0a0f1c]/70 border border-gray-300 dark:border-[#334155] rounded-2xl shadow-lg dark:shadow-[0_0_30px_#00FFF7] p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-cyan-300 tracking-wider mb-6">
          🔐 Login Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 dark:text-red-500 text-sm font-semibold text-center -mt-2 mb-4">
              ⚠️ {error}
            </p>
          )}
          {[
            {
              name: "emailOrUsername",
              label: "Username or Email",
              type: "text",
            },
            { name: "password", label: "Password", type: "password" },
          ].map(({ name, label, type }) => (
            <div className="relative" key={name}>
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                placeholder={label}
                className={`peer h-12 w-full rounded-md border  text-lg bg-transparent px-3 pt-4 dark:font-mono
                  text-gray-800 dark:text-cyan-100
                  border-gray-400 dark:border-cyan-800
                  placeholder-transparent
                  focus:outline-none focus:ring-1 dark:focus:ring-cyan-500 dark:focus:border-cyan-500 transition-all`}
              />
              <label
                htmlFor={name}
                className={`absolute left-3 transition-all pointer-events-none
                  ${
                    formData[name]
                      ? "hidden"
                      : "top-3.5 text-base text-gray-500 dark:text-gray-400"
                  }
                  peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-cyan-300`}
              >
                {label}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`hover:bg-red-700  w-full py-3 rounded-lg bg-red-600 dark:bg-gradient-to-r from-[#3A86FF] to-[#00FFF7] hover:from-blue-600 hover:to-cyan-400 transition duration-300 text-white font-semibold tracking-wide dark:shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          <div className="flex justify-between text-sm pt-4 text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="dark:hover:text-cyan-400 hover:text-blue-600 "
            >
              🚀 Create Account
            </button>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="dark:hover:text-cyan-400 hover:text-blue-600"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <CustomToast />
      </div>
    </div>
  );
};

export default Login;
