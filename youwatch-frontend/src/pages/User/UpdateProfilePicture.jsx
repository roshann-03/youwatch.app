import { useState, useEffect } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.avatar) setAvatarPreview(user.avatar);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return toast.error("Please select an avatar image.");

    setLoading(true);
    setMessage("Updating Avatar...");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await axiosFormData.patch("/users/avatar", formData);
      const updatedAvatar = response.data?.data?.avatar;

      if (updatedAvatar) {
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...user, avatar: updatedAvatar };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAvatarPreview(updatedAvatar);
        toast.success("✅ Avatar updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-6 rounded-2xl shadow-xl border dark:border-cyan-500 dark:bg-[#111827]/90 bg-white/90 transition-all backdrop-blur-md font-sans dark:font-futuristic">
      {/* Overlay when loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center rounded-2xl">
          <p className="text-white text-lg font-semibold animate-pulse">
            {message}
          </p>
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl text-center font-semibold text-gray-800 dark:text-cyan-300 tracking-wide mb-6">
        🖼️ Update Avatar
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 z-20 relative">
        {/* Avatar Preview */}
        <div className="flex justify-center">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-40 h-40 rounded-full border-4 border-blue-500 dark:border-cyan-400 shadow-lg object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 flex items-center justify-center text-center">
              No Image
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-cyan-500 dark:hover:file:bg-cyan-600 file:transition cursor-pointer text-sm text-gray-700 dark:text-gray-300"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-cyan-500 hover:to-pink-500"
          } shadow-lg`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </div>
          ) : (
            "Update Avatar"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
