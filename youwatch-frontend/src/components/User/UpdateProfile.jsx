import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!avatarFile) return alert("Please select an avatar image.");

    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/users/avatar",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedAvatar = response.data?.data?.avatar;
      if (updatedAvatar) {
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...user, avatar: updatedAvatar };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAvatarPreview(updatedAvatar); // Set new avatar as preview
        alert("Avatar updated successfully!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Update Avatar</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full
                       file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Avatar"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
