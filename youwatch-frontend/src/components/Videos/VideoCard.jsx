import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const VideoCard = ({ video, isOptions = false }) => {
  const navigate = useNavigate();
  const notify = (message) => toast(message);
  const [showOptions, setShowOptions] = useState(false);
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval !== 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval !== 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval !== 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval !== 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval !== 1 ? "s" : ""} ago`;

    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  };

  const handleClick = () => {
    navigate(`/video/${video?._id}`);
    window.scrollTo(0, 0);
  };

  const videoTitleTruncate = (title) => {
    if (title.split(" ").length > 10) {
      return title.split(" ").splice(0, 10).join(" ") + "...";
    } else {
      return title;
    }
  };
  const handleOptions = (e) => {
    e.stopPropagation();
    if (e.target.id === video?._id) {
      setShowOptions(!showOptions);
    }
  };
  const handleVideoDelete = async () => {
    await axios.delete(`http://localhost:8000/api/v1/videos/${video?._id}`, {
      withCredentials: true,
    });
    setShowOptions(false);
    notify("Video deleted successfully");
    window.location.reload();
  };

  const handleVideoUpdate = (video) => {
    navigate(`/update-video`, { state: { video } });
    setShowOptions(false);
    notify("Video updated successfully");
  };

  return (
    <div
      className="video-card flex flex-col bg-black shadow-sm overflow-hidden cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-2"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          className="w-full h-44 object-cover rounded-xl"
          src={video?.thumbnail}
          alt={video?.title}
        />
        <h3 className="font-medium text-sm absolute bottom-1 right-1 text-white bg-black bg-opacity-65 px-2 rounded">
          {Math.floor(video?.duration / 60)}:
          {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
        </h3>
      </div>

      <div className="flex items-start gap-2 p-1">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {video?.owner.avatar && (
            <img
              src={video.owner.avatar}
              alt={`${video.owner.name}'s avatar`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 relative">
          <h3 className="font-medium text-gray-50 break-words">
            {videoTitleTruncate(video?.title)}
          </h3>
          <p className="text-gray-300 ">
            {video?.owner?.name || video?.owner?.username}
          </p>
          <p className="text-[#ababab]  text-sm font-medium">
            {video?.views} views • {timeAgo(video?.createdAt)}
          </p>
          {isOptions && (
            <div
              onClick={(e) => {
                handleOptions(e);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
            >
              <svg
                id={video?._id}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {showOptions && (
                <div className="absolute right-10 top-5 rounded-lg  bg-zinc-600">
                  <ul className="w-full h-full rounded-lg py-2 px-5">
                    <li
                      onClick={() => handleVideoUpdate(video)}
                      className="text-gray-300  hover:text-gray-400"
                    >
                      Update
                    </li>
                    <li
                      onClick={() => handleVideoDelete(video?._id)}
                      className="text-gray-300  hover:text-gray-400"
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
