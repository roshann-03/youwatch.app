import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const OtpVerification = ({ onLogin }) => {
  const notify = (message) => toast(message);
  const location = useLocation();
  const { user } = location.state || {};
  const apiUrl = "http://localhost:8000/api/v1/otp/verify";

  useEffect(() => {
    notify("OTP sent to your email. Please check your inbox.");
  }, []);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      notify("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        apiUrl,
        { otp, user },
        { withCredentials: true }
      );

      if (response.status === 410) {
        notify("OTP expired. Please request a new one.");
        setOtp("");
        setLoading(false);
      } else if (response.status === 400) {
        notify("Invalid OTP. Please try again.");
        setOtp("");
        setLoading(false);
      } else if (response.status === 200) {
        onLogin(true);
        notify("OTP verified successfully!");
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setOtp("");
        navigate("/");
        setLoading(false);
        // Redirect after successful verification
      }
    } catch (error) {
      notify(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          OTP Verification
        </h2>
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
            className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default OtpVerification;
