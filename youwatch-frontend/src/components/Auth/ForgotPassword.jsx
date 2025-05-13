import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true); // Start loading
      await axios.post(
        "http://localhost:8000/api/v1/users/forgot-password",
        {
          email,
        },
        { withCredentials: true }
      );

      toast.success("Reset link sent to your email");
      setEmail("");
      navigate("/login", {
        state: { message: "Reset link sent to your email" },
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full text-white p-3 rounded transition duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <Link to="/login" className="flex justify-end pt-2 text-blue-800">
          Back to login
        </Link>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
