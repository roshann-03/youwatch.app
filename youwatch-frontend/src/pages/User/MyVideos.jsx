import { useState, useEffect } from "react";
import VideoCard from "../../components/Videos/VideoCard";
import { axiosJSON } from "../../api/axiosInstances";
import { useNavigate } from "react-router-dom";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [videoToDelete, setVideoToDelete] = useState(null); // Store the video to be deleted
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosJSON.get(`/videos/c/${user._id}`);
        const videoData = response?.data.data;
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos", error);
        setVideos([]);
      }
    };
    fetchVideos();
  }, [user._id]);

  const handleDeleteClick = (video) => {
    setVideoToDelete(video); // Set the video to delete
  };

  const handleDeleteConfirm = async () => {
    try {
      // Call API to delete video
      const response = await axiosJSON.delete(`/videos/${videoToDelete._id}`);
      if (response.status === 200) {
        // Remove deleted video from the state
        setVideos(videos.filter((video) => video._id !== videoToDelete._id));
        setVideoToDelete(null); // Reset the modal state
        window.location.href = window.location.href;
      }
    } catch (error) {
      console.error("Error deleting video", error);
    }
  };

  const handleUploadClick = () => {
    navigate("/upload"); // Navigate to the upload page when clicked
  };

  return (
    <div className="w-full min-h-screen dark:bg-black bg-gray-100 flex flex-col">
      <div className="flex flex-col items-center p-5">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 w-full">
            {videos.map((video) => (
              <div key={video._id} className="relative">
                <VideoCard
                  video={video}
                  isOptions={true}
                  onDeleteClick={() => handleDeleteClick(video)} // Pass delete click handler
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 dark:text-white">
            <h2 className="text-xl font-bold ">No videos found</h2>
            <p className="mt-4 text-gray-400">
              It looks like you haven't uploaded any videos yet.
            </p>
            <div className="mt-6">
              <button
                onClick={handleUploadClick}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Upload Your First Video
              </button>
            </div>
            <div className="mt-4 text-gray-500 dark:text-gray-400">
              <p>
                If you want to explore content, check out some popular videos
                below:
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="text-blue-400 hover:underline"
              >
                Explore Videos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conditional rendering for Delete Modal */}
      {videoToDelete && (
        <DeleteModal
          isOpen={true}
          onClose={() => setVideoToDelete(null)} // Close modal
          onConfirm={handleDeleteConfirm} // Handle confirmation
          videoTitle={videoToDelete.title} // Pass video title to modal
        />
      )}
    </div>
  );
};

export default MyVideos;
