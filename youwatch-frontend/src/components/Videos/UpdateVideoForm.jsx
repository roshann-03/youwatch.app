import { useState } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VideoUpdateForm = () => {
  const location = useLocation();
  const { video } = location.state || {};
  const navigate = useNavigate();
  const notify = (message) => toast(message);

  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [isPublished, setIsPublished] = useState(video?.isPublished || false);
  const [thumbnail, setThumbnail] = useState(video?.thumbnail || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("existingThumnailURL", video?.thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublished", isPublished);

    try {
      setLoading(true);
      await axiosFormData.patch(`/videos/${video?._id}`, formData);
      notify("Video updated successfully");
      navigate("/my-videos", { replace: true });
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-[#0a0f1c] px-4 py-10">
      <div className="w-full max-w-xl dark:bg-[#111827] bg-white p-8 rounded-2xl shadow-lg dark:shadow-[0_0_25px_#00FFF7] border border-gray-300 dark:border-cyan-600 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-cyan-300 dark:font-futuristic tracking-wide">
          🛠️ Update Your Video
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-cyan-100 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-300 dark:bg-[#1e293b] dark:border-cyan-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-cyan-100 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-300 dark:bg-[#1e293b] dark:border-cyan-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="text-sm font-semibold text-gray-700 dark:text-cyan-100 mr-3">
              Publish
            </label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 accent-blue-600 dark:accent-cyan-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-cyan-100 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700
              dark:file:bg-cyan-600 dark:hover:file:bg-cyan-700 dark:file:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-bold text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-pink-500 dark:to-purple-700 dark:hover:from-pink-600 dark:hover:to-purple-800"
            }`}
          >
            {loading ? "Updating..." : "Update Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpdateForm;
