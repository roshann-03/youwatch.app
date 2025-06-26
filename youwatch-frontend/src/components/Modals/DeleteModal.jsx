import { axiosJSON } from "../../api/axiosInstances";
import { useAuth } from "../../ContextAPI/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteModal = ({ isOpen, onClose, onConfirm, videoTitle, videoId }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await axiosJSON.delete(`/videos/${videoId}`);

      if (response.status === 200) {
        toast.success("Video deleted successfully");
        if (onConfirm) onConfirm(); // let parent react
        logout();
        navigate("/login");
      } else {
        toast.error(response.data?.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 dark:bg-opacity-80 px-4">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-cyan-400 p-8 rounded-2xl shadow-lg
        dark:shadow-[0_0_20px_#00FFF7] dark:font-futuristic transition-all animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-cyan-300 tracking-wider mb-6">
          🔐 Confirm Video Deletion
        </h2>

        <p className="text-center text-gray-600 dark:text-cyan-200 mb-8">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black dark:text-cyan-100">
            “{videoTitle}”
          </span>
          ?<br />
          <span className="font-bold text-red-600 dark:text-pink-400">
            This action cannot be undone.
          </span>
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-6 py-3 text-lg font-semibold rounded-lg transition-all
              border border-gray-400 text-gray-700 hover:bg-gray-200
              dark:border-cyan-500 dark:text-cyan-300 dark:hover:bg-[#1e293b]
              dark:shadow-[0_0_10px_#00FFF7] dark:hover:shadow-[0_0_15px_#00FFF7]"
          >
            ❌ Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-3 text-lg font-semibold rounded-lg transition-all
              bg-red-600 text-white hover:bg-red-700
              dark:bg-gradient-to-r dark:from-pink-600 dark:to-red-600
              dark:hover:from-pink-700 dark:hover:to-red-700
              dark:shadow-[0_0_15px_#FF005C] dark:hover:shadow-[0_0_20px_#FF2F70]"
          >
            🚨 Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
