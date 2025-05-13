import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

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
      notify("username or email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          emailOrUsername,
          password,
        },
        { withCredentials: true }
      );
      if (!response) {
        notify("User not found");
        return;
      }
      if (response.status === 404) {
        notify("User not found");
        return;
      }
      if (response.status === 401) {
        notify("email or username or password is invalid");
      }
      if (response.status === 200) {
        localStorage.removeItem("user");
        const user = response?.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        notify("Login successful!");
        onLogin();
        navigate("/"); // Redirect to dashboard or appropriate page
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
    <div className="flex w-full justify-center items-center  h-screen bg-gradient-to-r from-gray-800 via-gray-700  to-gray-900">
      <div className="p-8 rounded-lg shadow-xl  bg-gray-950 h-fit w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-100">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="username or Email"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className="border-b focus:outline-none font-[inter] tracking-tight  text-gray-200 text-lg border-gray-300 px-3 py-1 mb-4 w-full bg-transparent"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border-b focus:outline-none font-[inter] tracking-tight  text-gray-200 text-lg border-gray-300 px-3 py-1 mb-4 w-full bg-transparent"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="flex justify-between tracking-tighter">
            <button
              onClick={() => navigate("/register")}
              className="mt-4 text-center text-red-500"
            >
              Don't have an account?{" "}
            </button>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="mt-4 text-center text-gray-300"
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
