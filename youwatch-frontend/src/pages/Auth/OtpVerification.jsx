import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";

const OTPVerification = () => {
  const notify = (message) => toast(message);
  const location = useLocation();
  const { login } = useAuth();
  const { user } = location.state || {};

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
      const response = await axiosJSON.post(
        "/otp/verify",
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
        login();
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
    <div className=" h-screen flex justify-center items-center dark:bg-gradient-to-tr dark:from-slate-700 dark:to-slate-900 bg-gradient-to-r from-gray-300 via-gray-50 to-gray-300 overflow-hidden">
      <div className="dark:bg-gray-800 bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="mb-6 text-2xl font-bold text-center dark:text-gray-200 text-gray-700">
          OTP Verification
        </h2>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-500 rounded-md bg-white dark:bg-gray-600 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 ${
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

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default OTPVerification;
