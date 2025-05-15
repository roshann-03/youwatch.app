import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import { axiosJSON } from "../../api/axiosInstances";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notify = (message) => toast(message);

  useEffect(() => {
    if (location.state?.message) {
      notify(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrUsername, password } = formData;

    if (!emailOrUsername) {
      notify("Username or email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosJSON.post("/users/login", {
        emailOrUsername,
        password,
      });

      if (response.status === 200) {
        localStorage.removeItem("user");
        const user = response.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        notify("Login successful!");
        onLogin();
        navigate("/");
      } else {
        notify("Invalid credentials.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Invalid email or username or password. Please try again.";
      notify(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md dark:bg-gray-950 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center dark:text-white mb-6">
          Login Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="peer h-12 w-full rounded-md border border-gray-600 bg-transparent px-3 pt-4 dark:text-white placeholder-transparent focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                placeholder={label}
              />
              <label
                htmlFor={name}
                className="absolute left-3 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-400"
              >
                {label}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 text-white font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          <div className="flex justify-between text-sm text-gray-400 pt-4">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="hover:text-red-400"
            >
              Don’t have an account?
            </button>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="hover:text-red-400"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
