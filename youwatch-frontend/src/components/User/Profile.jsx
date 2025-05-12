import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    fullName: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        fullName: storedUser.fullName || "",
        username: storedUser.username || "",
        email: storedUser.email || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        "http://localhost:8000/api/v1/users/update-account",
        user,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(user));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete("http://localhost:8000/api/v1/users/delete-account", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-6 bg-gray-900 min-h-screen text-white">
      {/* Avatar Upload */}
      <div className="w-full lg:w-1/2">
        <UpdateProfile />
      </div>

      {/* Profile Update Form */}
      <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200"
          >
            Update Profile
          </button>
        </form>

        {/* Delete Account Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4 text-sm text-gray-300">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
