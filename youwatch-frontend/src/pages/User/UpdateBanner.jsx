import { useState, useEffect } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { toast } from "react-toastify"; // Import toast for notifications

const UpdateBanner = () => {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For dynamic message like "Updating Banner..."

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.coverImage) {
      setBannerPreview(user.coverImage); // Set banner image if available
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result); // Update banner preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!bannerFile) {
      toast.error("Please select a banner image.");
      return;
    }

    setLoading(true);
    setMessage("Updating Banner...");

    const formData = new FormData();
    formData.append("coverImage", bannerFile); // Use coverImage instead of avatar

    try {
      const response = await axiosFormData.patch(
        "/users/cover-image",
        formData
      );

      const updatedCoverImage = response.data?.data?.coverImage;
      if (updatedCoverImage) {
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...user, coverImage: updatedCoverImage }; // Update banner image in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setBannerPreview(updatedCoverImage); // Set new banner image as preview
        toast.success("Banner image updated successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error updating banner image:", error);
      toast.error("Something went wrong. Please try again."); // Error toast
    } finally {
      setLoading(false);
      setMessage(""); // Reset the message
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto p-6 text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-lg">
      {/* Dimmed background overlay when loading */}
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      )}

      {/* Update Page Content */}
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Update Banner Image
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
          {/* Banner Preview */}
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="w-full h-40 object-cover rounded-lg border-4 border-blue-500"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-gray-300 flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Update Banner Image"
          )}
        </button>
      </form>

      {/* Loading Message */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="text-white text-xl font-semibold">{message}</div>
        </div>
      )}
    </div>
  );
};

export default UpdateBanner;
