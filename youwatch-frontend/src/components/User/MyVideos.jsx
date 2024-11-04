import React, { useState, useEffect } from "react";
import VideoCard from "../Videos/VideoCard";
import axios from "axios";
const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/videos/c/${user._id}`,
          {
            withCredentials: true,
          }
        );
        const videoData = response?.data.data;
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
      <div className="flex flex-wrap w-full h-fit p-5 justify-between bg-black">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video?._id} isOptions={true} video={video} />)
        ) : (
          <div>No videos found</div>
        )}
      </div>
    </div>
  );
};

export default MyVideos;
