import { useState, useEffect } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { toast } from "react-toastify";

const UpdateBanner = () => {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.coverImage) setBannerPreview(user.coverImage);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) return toast.error("Please select a banner image.");

    setLoading(true);
    setMessage("Updating Banner...");

    const formData = new FormData();
    formData.append("coverImage", bannerFile);

    try {
      const response = await axiosFormData.patch(
        "/users/cover-image",
        formData
      );
      const updatedCoverImage = response.data?.data?.coverImage;

      if (updatedCoverImage) {
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...user, coverImage: updatedCoverImage };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setBannerPreview(updatedCoverImage);
        toast.success("✅ Banner image updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto p-6 rounded-2xl shadow-xl border dark:border-pink-500 dark:bg-[#0f172a]/90 bg-white/90 transition-all backdrop-blur-md font-sans dark:font-futuristic">
      {/* Overlay on loading */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-2xl">
          <p className="text-white text-lg font-semibold animate-pulse">
            {message}
          </p>
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center tracking-wide mb-6 text-gray-800 dark:text-pink-400">
        🖼️ Update Banner Image
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 z-20 relative">
        {/* Banner Preview */}
        <div className="w-full h-40 rounded-lg overflow-hidden border-4 shadow-md dark:border-pink-500">
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
              No Image
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-pink-600 dark:hover:file:bg-pink-700 transition cursor-pointer text-sm text-gray-700 dark:text-gray-300"
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
            "Update Banner Image"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateBanner;
