import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { axiosJSON } from "../../api/axiosInstances";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosJSON.get(`/videos`);
        const videoData = response?.data.data.docs;
        setVideos(videoData);
      } catch (error) {
        setVideos([]);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#0a0f1c] text-[#0f172a] dark:text-[#F1F5F9] px-4 py-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video?._id}
                className="transition-all duration-300 transform hover:scale-[1.01] dark:hover:shadow-[0_0_15px_#00FFF7] rounded-lg"
              >
                <VideoCard video={video} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center font-bold text-2xl text-[#475569] dark:text-cyan-400 dark:font-futuristic mt-20 animate-pulse">
              No videos found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
