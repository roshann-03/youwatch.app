import { useState, useEffect } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { toast } from "react-toastify"; // Import toast

const UpdateProfile = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For dynamic message like "Updating Avatar"

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!avatarFile) {
      toast.error("Please select an avatar image.");
      return;
    }

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
        setAvatarPreview(updatedAvatar); // Set new avatar as preview
        toast.success("Avatar updated successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Something went wrong. Please try again."); // Error toast
    } finally {
      setLoading(false);
      setMessage(""); // Reset the message
    }
  };

  return (
    <div className="relative mx-auto p-6 dark:bg-gray-800 dark:text-white text-black rounded-lg shadow-lg">
      {/* Dimmed background overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      )}

      {/* Update Page Content */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Avatar</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Preview */}
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300 flex justify-center items-center text-gray-500">
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
            "Update Avatar"
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

export default UpdateProfile;
