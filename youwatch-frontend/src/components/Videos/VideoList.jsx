import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { axiosJSON } from "../../api/axiosInstances";
import { Navigate, useNavigate } from "react-router-dom";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

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
    <div className="w-full  min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
      <div className="w-full min-h-screen p-4 bg-opacity-90 dark:bg-gradient-to-b from-gray-800 to-black bg-white dark:text-white shadow-xl">
        {/* Video grid container */}
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video?._id} className="w-full h-auto mx-auto  ">
                {/* Ensure VideoCard takes full width on smaller screens */}
                <VideoCard video={video} />
              </div>
            ))
          ) : (
            <div className="text-center text-black font-bold text-2xl">
              No videos found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
