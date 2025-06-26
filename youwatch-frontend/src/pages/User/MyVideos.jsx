import { useState, useEffect } from "react";
import VideoCard from "../../components/Videos/VideoCard";
import { axiosJSON } from "../../api/axiosInstances";
import { useNavigate } from "react-router-dom";
import DeleteModal from "@/components/modals/DeleteModal"; // Make sure this path is correct

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosJSON.get(`/videos/c/${user._id}`);
        setVideos(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching videos", error);
        setVideos([]);
      }
    };
    fetchVideos();
  }, [user._id]);

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosJSON.delete(`/videos/${videoToDelete._id}`);
      if (response.status === 200) {
        setVideos((prev) =>
          prev.filter((video) => video._id !== videoToDelete._id)
        );
        setVideoToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting video", error);
    }
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <div className="w-full min-h-screen dark:bg-[#0a0f1c] bg-gray-100 transition-all font-sans dark:font-futuristic px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="relative">
                <VideoCard
                  video={video}
                  isOptions={true}
                  onDeleteClick={() => handleDeleteClick(video)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold dark:text-cyan-300 text-gray-800 mb-3">
              No Videos Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              It looks like you haven't uploaded any videos yet.
            </p>

            <button
              onClick={handleUploadClick}
              className="mt-6 bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-cyan-500 dark:to-fuchsia-600 hover:from-indigo-700 hover:to-pink-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
            >
              🚀 Upload Your First Video
            </button>

            <div className="mt-8 text-gray-600 dark:text-gray-400">
              <p>Or discover trending content</p>
              <button
                onClick={() => navigate("/explore")}
                className="mt-2 text-blue-500 hover:underline dark:text-cyan-300"
              >
                🌌 Explore Videos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {videoToDelete && (
        <DeleteModal
          isOpen={true}
          onClose={() => setVideoToDelete(null)}
          onConfirm={handleDeleteConfirm}
          videoTitle={videoToDelete.title}
        />
      )}
    </div>
  );
};

export default MyVideos;
