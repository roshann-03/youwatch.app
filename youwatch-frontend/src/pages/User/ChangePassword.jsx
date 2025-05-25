import { useEffect, useState } from "react";
import { axiosJSON } from "../../api/axiosInstances"; // Assuming axiosJSON is a pre-configured axios instance.
import { toast } from "react-toastify"; // Import toast

const ChangePassword = ({ closeModel }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosJSON.post("/users/change-password", {
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        // On successful password change
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        closeModel();
      }
    } catch (error) {
      // On error, show an error message
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="dark:bg-gray-800 bg-gray-100 dark:text-white text-black rounded-lg shadow-xl max-w-md w-full p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl text-transparent  font-semibold mb-6 text-center text-gradient bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
          Change Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-semibold dark:text-gray-300"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-2 p-3 bg-white dark:text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold dark:text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 p-3 bg-white dark:text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 p-3 bg-white dark:text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={closeModel}
            className="text-sm bg-red-500 py-3 w-full rounded-lg text-white font-bold  dark:text-gray-200 dark:hover:text-gray-300 hover:bg-red-600 hover:scale-105 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
