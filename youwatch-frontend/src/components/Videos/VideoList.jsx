import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { axiosJSON } from "../../api/axiosInstances";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [openOptionsId, setOpenOptionsId] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosJSON.get(`/videos`);
        const videoData = response?.data.data.docs;
        console.log(videoData);
        setVideos(videoData);
      } catch (error) {
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  const handleDeleteSuccess = (deletedId) => {
    setVideos((prev) => prev.filter((v) => v._id !== deletedId));
  };

  const publishedVideos = videos.filter((video) => video.isPublished);

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
      <div className="w-full min-h-screen p-4 bg-opacity-90 dark:bg-gradient-to-b from-gray-800 to-black bg-white dark:text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {publishedVideos.length > 0 ? (
            publishedVideos.map((video) => (
              <div key={video._id} className="w-full h-auto mx-auto">
                <VideoCard
                  video={video}
                  openOptionsId={openOptionsId}
                  setOpenOptionsId={setOpenOptionsId}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-black font-bold text-2xl col-span-full">
              No videos found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
