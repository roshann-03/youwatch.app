import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";
import CustomToast from "@/components/custom/CustomToast";
const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { user } = location.state || {};

  const notify = (msg) => toast(msg);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user) {
      notify("OTP sent to your email. Please check your inbox.");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only digit or empty

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto focus to next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (!/^\d{6}$/.test(pasteData.join(""))) return;

    setOtp(pasteData);
    pasteData.forEach((digit, i) => {
      inputRefs.current[i].value = digit;
    });
    inputRefs.current[5]?.focus();
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    setResending(true);
    try {
      const response = await axiosJSON.post("/otp/send", {
        email: user?.email,
      });
      if (response.status === 200) {
        notify("OTP resent to your email.");
        setOtp(Array(6).fill(""));
        setTimeLeft(30); // Restart countdown
      } else {
        notify("Failed to resend OTP");
      }
    } catch (err) {
      notify("Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return notify("Please enter 6-digit OTP");

    setLoading(true);
    try {
      const response = await axiosJSON.post(
        "/otp/verify",
        { otp: otpValue, user },
        { withCredentials: true }
      );

      if (response.status === 200) {
        login();
        notify("OTP verified successfully!");
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/");
      } else {
        notify("OTP verification failed");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-[#0a0f1c] dark:to-[#0f172a] p-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#111827] rounded-2xl border border-gray-900 dark:shadow-[0_0_20px_#00FFF7] p-8 font-sans dark:font-futuristic">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-cyan-300 tracking-wider">
          OTP Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Blocks */}
          <div
            onPaste={handlePaste}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className=" lg:w-10 lg:h-12 w-8 h-10 text-center text-2xl font-bold border dark:border-cyan-400 border-gray-400 rounded-md bg-white dark:bg-[#1e293b] text-gray-800 dark:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-md text-white transition-all duration-200 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex justify-center items-center mt-3">
          <button
            type="button"
            disabled={timeLeft > 0 || resending}
            onClick={handleResendOTP}
            className={`text-sm font-semibold transition-all ${
              timeLeft > 0 || resending
                ? "text-gray-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-700 text-white px-5 py-3 rounded-lg dark:text-white-400 dark:hover:text-cyan-200"
            }`}
          >
            {resending
              ? "Resending..."
              : timeLeft > 0
              ? `Resend OTP in ${timeLeft}s`
              : "Resend OTP"}
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          OTP will expire in <span className="font-semibold">5 minutes</span>
        </p>

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-cyan-400">
          <Link
            to="/login"
            className="text-red-500 hover:underline dark:text-cyan-300"
          >
            Back to Login
          </Link>
        </p>

        <CustomToast />
      </div>
    </div>
  );
};

export default OTPVerification;
