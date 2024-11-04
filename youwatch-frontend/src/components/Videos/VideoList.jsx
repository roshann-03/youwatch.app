import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/videos`, {
          withCredentials: true,
        });
        const videoData = response?.data.data.docs;
        setVideos(videoData);
      } catch (error) {
        console.log("No video found");
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div className="flex flex-wrap h-fit  w-full p-5 gap-5 bg-black">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video?._id} video={video} />)
        ) : (
          <div>No videos found</div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
