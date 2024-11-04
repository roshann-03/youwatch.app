import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP

  const notify = (message) => toast(message);

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      notify("Please enter your email address");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/request-otp", { email });
      notify("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (error) {
      notify("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      notify("Please enter the OTP sent to your email");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-otp`,
        { email, otp }
      );

      if (response.status === 200) {
        notify("OTP verified! You can now reset your password.");
        // Redirect to reset password page or show reset password form
      }
    } catch (error) {
      notify("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          {step === 1 ? "Forgot Password" : "Verify OTP"}
        </h2>
        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 mb-4 w-full rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
            >
              Request OTP
            </button>
            <p className="mt-4 text-sm text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 p-3 mb-4 w-full rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
            >
              Verify OTP
            </button>
            <p className="mt-4 text-sm text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
