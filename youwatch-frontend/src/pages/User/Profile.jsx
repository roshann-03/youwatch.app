import { useState, useEffect } from "react";
import { axiosJSON } from "../../api/axiosInstances";
import UpdateProfile from "./UpdateProfilePicture";
import UpdateBanner from "./UpdateBanner";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword"; // Your ChangePassword component
import CustomToast from "@/components/custom/CustomToast";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false); // State to control the password change modal

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
    <div className="flex flex-col lg:flex-row gap-10 p-8 bg-gray-200 dark:bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800 text-white">
      <CustomToast />

      {/* Avatar and Banner Upload Section */}
      <div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
        <UpdateProfile />
        <UpdateBanner />
      </div>

      {/* Profile Update Form */}
      <div className="w-full lg:w-2/3">
        <div className="dark:bg-[#111827] bg-white h-full rounded-xl shadow-lg dark:shadow-[0_0_20px_#00FFF7] p-6 border dark:border-cyan-500 transition-all">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 dark:from-cyan-400 dark:to-pink-500 tracking-wide dark:font-futuristic">
            🧬 User Profile
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-cyan-200 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-[#1e293b] text-black dark:text-white border border-gray-400 dark:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-400"
                required
              />
            </div>

            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-cyan-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-[#1e293b] text-black dark:text-white border border-gray-400 dark:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-lg transition duration-300 text-white
          bg-gradient-to-r from-amber-600 to-rose-500 hover:from-amber-700 hover:to-rose-600
          dark:bg-gradient-to-r dark:from-cyan-500 dark:to-fuchsia-500 dark:hover:from-cyan-400 dark:hover:to-pink-500
          dark:border dark:border-cyan-400 dark:shadow-[0_0_10px_#00FFF7]
          dark:font-futuristic"
            >
              🚀 Update Profile
            </button>
          </form>

          {/* Change Password Button */}
          <div className="mt-6 text-center">
            <button
              onClick={openPasswordModal}
              className="w-full py-3 rounded-lg font-semibold transition duration-300 text-white
          bg-blue-600 hover:bg-blue-700
          dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-400 dark:hover:from-cyan-400 dark:hover:to-blue-500
          dark:border dark:border-cyan-300 dark:shadow-[0_0_10px_#00FFF7]
          dark:font-futuristic"
            >
              🔐 Change Password
            </button>
          </div>

          {/* Delete Account Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 rounded-lg font-semibold transition duration-300 text-white
          bg-red-600 hover:bg-red-700
          dark:bg-gradient-to-r dark:from-red-500 dark:to-pink-500 dark:hover:from-pink-600 dark:hover:to-red-600
          dark:border dark:border-pink-400 dark:shadow-[0_0_10px_#FF007C]
          dark:font-futuristic"
            >
              🧨 Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordChange && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closePasswordModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-0 max-w-md w-full"
          >
            <ChangePassword
              closeModel={closePasswordModal}
              onSuccess={handlePasswordChangeSuccess}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#111827] border border-gray-300 dark:border-cyan-500 rounded-2xl shadow-xl dark:shadow-[0_0_20px_#00FFF7] max-w-sm w-full p-6 relative dark:font-futuristic transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-cyan-300 text-center mb-4 tracking-wide">
              ⚠️ Confirm Deletion
            </h3>

            <p className="text-center text-sm text-gray-700 dark:text-cyan-100 mb-6">
              Are you sure you want to delete your account?{" "}
              <span className="text-red-600 dark:text-pink-400 font-semibold">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-200
          dark:border-cyan-600 dark:text-cyan-300 dark:hover:bg-[#1e293b] transition-all font-semibold"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`w-1/2 py-2 rounded-lg text-white font-semibold transition-all ${
                  isDeleting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 dark:bg-gradient-to-r dark:from-pink-500 dark:to-red-600 dark:hover:from-pink-600 dark:hover:to-red-700"
                }`}
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
