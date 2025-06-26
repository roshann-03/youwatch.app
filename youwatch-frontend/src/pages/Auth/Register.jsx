import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import { axiosFormData, axiosJSON } from "../../api/axiosInstances";
import CustomToast from "@/components/custom/CustomToast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const navigate = useNavigate();
  const notify = (msg) => toast(msg);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      if (name === "avatar") setAvatarPreview(previewUrl);
      else if (name === "coverImage") setCoverPreview(previewUrl);
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      username,
      email,
      fullName,
      password,
      confirmPassword,
      avatar,
      coverImage,
    } = formData;

    const errors = [];

    if (!username || !email || !fullName || !password || !confirmPassword) {
      errors.push("All fields are required.");
    }
    if (
      username.length < 3 ||
      username.length > 20 ||
      !/^[a-zA-Z0-9._]+$/.test(username)
    ) {
      errors.push(
        "Username must be 3-20 characters and alphanumeric (with . or _)."
      );
    }
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));

    try {
      setLoading(true);
      const res = await axiosFormData.post("/users/register", form);
      if (res.status === 200) {
        const { email } = res.data.data;
        notify("Sending OTP...");
        setOtpLoading(true);
        const otpRes = await axiosJSON.post("/otp/send", { email });
        if (otpRes.status === 200) {
          navigate("/otp-verification", { state: { user: res.data.data } });
        } else notify("Failed to send OTP");
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1c] p-4 dark:font-futuristic">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] p-8 rounded-2xl  border border-gray-900 dark:shadow-[0_0_15px_#00FFF7]">
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-cyan-300 tracking-wider mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formErrors.length > 0 && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 rounded-md p-4 text-sm space-y-2">
              {formErrors.map((err, i) => (
                <p key={i}>⚠️ {err}</p>
              ))}
            </div>
          )}

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-cyan-400 mb-1">
              Cover Image
            </label>
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-300 dark:border-cyan-700"
              />
            )}
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-gray-700 dark:text-white border border-gray-400 dark:border-gray-600 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-pink-500 file:to-red-500 file:text-white hover:file:from-red-600 hover:file:to-pink-700 transition-all"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-cyan-400 mb-1">
              Profile Picture (Avatar)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview || "/user.webp"}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-gray-700 dark:text-white border border-gray-400 dark:border-gray-600 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-cyan-500 file:text-white hover:file:from-blue-600 hover:file:to-cyan-600 transition-all"
              />
            </div>
          </div>

          {/* Inputs */}
          {["username", "email", "fullName"].map((field) => (
            <div className="relative" key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="peer w-full h-12 rounded-md border border-gray-300 dark:border-cyan-700 bg-transparent px-3 pt-4 text-[#0f172a] dark:text-white placeholder-transparent focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-2 text-sm text-gray-400 dark:text-cyan-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          {/* Password Fields */}
          {["password", "confirmPassword"].map((field, idx) => (
            <div className="relative" key={field}>
              <input
                type={
                  idx === 0
                    ? showPassword
                      ? "text"
                      : "password"
                    : showConfirmPassword
                    ? "text"
                    : "password"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="peer w-full h-12 rounded-md border border-gray-300 dark:border-cyan-700 bg-transparent px-3 pt-4 text-[#0f172a] dark:text-white placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-2 text-sm text-gray-400 dark:text-cyan-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
              >
                {field === "password" ? "Password" : "Confirm Password"}
              </label>
              <button
                type="button"
                onClick={() =>
                  idx === 0
                    ? setShowPassword(!showPassword)
                    : setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute top-3 right-3 text-gray-500 dark:hover:text-cyan-300"
              >
                {idx === 0 ? (
                  showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )
                ) : showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || otpLoading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-all duration-300 ${
              loading || otpLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "dark:bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Registering..."
              : otpLoading
              ? "Sending OTP..."
              : "Register"}
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>

        <CustomToast />
      </div>
    </div>
  );
};

export default Register;
