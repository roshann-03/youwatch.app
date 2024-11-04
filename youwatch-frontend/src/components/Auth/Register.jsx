import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false); // New state for OTP loading
  const navigate = useNavigate();

  const notify = (message) => toast(message);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "avatar" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, fullName, password, confirmPassword, avatar } =
      formData;

    if (
      !username ||
      !email ||
      !fullName ||
      !password ||
      !confirmPassword ||
      !avatar
    ) {
      notify("Please fill in all fields");
      return;
    }
    if (username.length < 3) {
      notify("Username must be at least 3 characters long");
      return;
    }
    if (username.length > 20) {
      notify("Username must be less than 20 characters long");
      return;
    }
    if (!username.match(/^[a-zA-Z0-9._]+$/)) {
      notify(
        "Username must only contain letters, numbers, periods, and underscores."
      );
      return;
    }

    if (password.length < 6) {
      notify("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      notify("Passwords do not match");
      return;
    }

    const apiUrl = "http://localhost:8000/api/v1/users/register";
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      setLoading(true); // Set loading state while registering
      const response = await axios.post(apiUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
      },{ withCredentials: true });

      if (response.status === 200) {
        const { email } = response.data.data;
        setOtpLoading(true); // Set loading state while sending OTP
        notify("Sending OTP...");
        try {
          const otpResponse = await axios.post(
            "http://localhost:8000/api/v1/otp/send",
            { email }
          );

          if (otpResponse.status === 200) {
            navigate("/otp-verification", {
              state: { user: response.data.data },
            });
          } else {
            notify("Cannot send OTP. Please try again.");
          }
        } catch (otpError) {
          console.error("Error sending OTP: ", otpError);
          notify("Failed to send OTP. Please try again.");
        } finally {
          setOtpLoading(false); // Ensure OTP loading is stopped
        }
      } else {
        notify("Username or email already exists");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      notify(message);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          {["username", "email", "fullName"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              className="border border-gray-300 p-3 mb-4 w-full rounded"
              required
            />
          ))}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-3 mb-4 w-full rounded"
            required
          />
          {["password", "confirmPassword"].map((field, index) => (
            <div className="relative mb-4" key={field}>
              <input
                type={
                  index === 0
                    ? showPassword
                      ? "text"
                      : "password"
                    : showConfirmPassword
                    ? "text"
                    : "password"
                }
                name={field}
                placeholder={
                  field === "password"
                    ? "Password (min 6 characters)"
                    : "Confirm Password"
                }
                value={formData[field]}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded"
                required
              />
              <button
                type="button"
                onClick={() =>
                  index === 0
                    ? setShowPassword(!showPassword)
                    : setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 text-gray-500 focus:outline-none"
              >
                {index === 0 ? (
                  showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )
                ) : showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Disable button only during registration
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
