import { useState, useEffect } from "react";
import { axiosJSON } from "../../api/axiosInstances";
import UpdateProfile from "./UpdateProfilePicture";
import UpdateBanner from "./UpdateBanner";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ChangePassword from "./ChangePassword"; // Your ChangePassword component

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false); // State to control the password change modal
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        fullName: storedUser.fullName || "",
        username: storedUser.username || "",
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
      const res = await axiosJSON.patch("/users/update-account", user);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axiosJSON.delete("/users/delete-account");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  const openPasswordModal = () => {
    setIsPasswordChange(true);
  };

  const closePasswordModal = () => {
    setIsPasswordChange(false);
  };

  // Handle password change success to close modal
  const handlePasswordChangeSuccess = () => {
    closePasswordModal();
    toast.success("Password changed successfully!");
  };

  return (
    <div className="flex flex-col lg:flex-row  gap-10 p-8 dark:bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800  text-white bg-gray-200">
      {/* Avatar and Banner Upload Section */}
      <div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
        {/* Avatar Section */}
        <UpdateProfile />
        {/* Banner Section */}
        <UpdateBanner />
      </div>

      {/* Profile Update Form */}
      <div className="w-full lg:w-2/3 ">
        <div className="dark:bg-gray-800 h-full rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            User Profile
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="w-full p-4 dark:bg-gray-700 bg-gray-100 text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleInputChange}
                className="w-full p-4 dark:bg-gray-700 bg-gray-100 text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-amber-600 hover:to-rose-500 transition duration-300"
            >
              Update Profile
            </button>
          </form>

          {/* Button to open password change modal */}
          <div className="mt-6 text-center">
            <button
              onClick={openPasswordModal}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
            >
              Change Password
            </button>
          </div>

          {/* Delete Account Button */}
          <div className="mt-8 text-center ">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full  py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>

        {!user.isGoogleUser && <ToastContainer />}
        {user.isGoogleUser && (
          <div>You cannot change the password for Google accounts.</div>
        )}
      </div>

      {/* Password Change Modal */}
      {isPasswordChange && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closePasswordModal}
        >
          <div
            className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {!user?.isGoogleUser ? (
              <ChangePassword
                closeModel={closePasswordModal}
                onSuccess={handlePasswordChangeSuccess}
              />
            ) : (
              "You have used google account to signup can't change the password"
            )}

            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={closePasswordModal}
                className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0  bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
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
