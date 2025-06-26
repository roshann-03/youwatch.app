import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosJSON } from "../../api/axiosInstances";
import DeleteModal from "../Modals/DeleteModal";

const VideoCard = ({ video, isOptions = false }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const optionsRef = useRef(null);

  const notify = (message) => toast(message);

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
    return title.split(" ").length > 10
      ? title.split(" ").splice(0, 10).join(" ") + "..."
      : title;
  };

  const handleOptions = (e) => {
    e.stopPropagation();
    setOpenOptionsId((prevId) => (prevId === video?._id ? null : video?._id));
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosJSON.delete(`/videos/${videoToDelete._id}`);
      notify("Video deleted successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting video", error);
      notify("Failed to delete video");
    }
  };

  const handleVideoUpdate = (video) => {
    navigate(`/update-video`, { state: { video } });
    setOpenOptionsId(null);
    notify("Video updated successfully");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOpenOptionsId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full font-sans dark:font-futuristic">
      <div
        onClick={handleClick}
        className="
          bg-[#F8FAFC] 
          dark:bg-[#0a0f1c] 
          rounded-xl 
          shadow-md 
          border border-transparent 
        
          transition-all 
          duration-300 
          cursor-pointer
          dark:font-futuristic
          dark:border-cyan-400
          dark:hover:border-cyan-600
          "
      >
        <div className="relative text-[#0f172a] dark:text-[#F1F5F9]">
          <img
            className="w-full h-44 object-cover rounded-t-xl"
            src={video?.thumbnail || "/fallback-thumbnail.jpg"}
            alt={video?.title}
          />
          <h3
            className="
            font-mono 
            font-semibold 
            text-sm 
            absolute bottom-1 right-1 
            text-white 
            bg-[#0f172a] bg-opacity-80 
            px-2 rounded 
            dark:bg-cyan-900 dark:bg-opacity-80
            dark:drop-shadow-[0_0_6px_#00FFF7]"
          >
            {Math.floor(video?.duration / 60)}:
            {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
          </h3>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div
            className="
            w-12 h-12 rounded-full overflow-hidden border-2
            border-[#3A86FF] dark:border-[#00FFF7]
            dark:drop-shadow-[0_0_10px_#00FFF7]"
          >
            <img
              src={video?.owner?.avatar || "/user.webp"}
              alt={`${video?.owner?.name || "User"}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 relative">
            <h3
              className="
              font-medium break-words
              dark:text-cyan-300 
              text-gray-900
              dark:font-futuristic
              font-sans
              tracking-wide
              hover:underline
              transition
              duration-300
            "
            >
              {videoTitleTruncate(video?.title)}
            </h3>
            <p className="text-sm text-[#475569] dark:text-[#94a3b8] font-mono">
              @{video?.owner?.name || video?.owner?.username || "Unknown"}
            </p>
            <p className="text-sm font-medium text-[#475569] dark:text-[#F1F5F9] font-mono">
              {video?.views} views • {timeAgo(video?.createdAt)}
            </p>

            {isOptions && (
              <div
                onClick={handleOptions}
                className="
                  absolute top-2 right-2
                  text-[#475569] dark:text-[#94a3b8]
                  hover:text-[#3A86FF] dark:hover:text-[#00FFF7]
                  cursor-pointer
                  select-none
                "
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

                {openOptionsId === video?._id && (
                  <div
                    ref={optionsRef}
                    className="
                      absolute z-50 right-6 top-0
                      rounded-lg 
                      bg-[#F8FAFC] dark:bg-[#1e293b]
                      border border-[#E2E8F0] dark:border-[#334155]
                      p-3 
                      shadow-2xl
                      dark:shadow-[0_0_15px_#00FFF7]
                      font-mono
                      min-w-[140px]
                    "
                  >
                    <ul className="space-y-2">
                      <li
                        onClick={() => handleVideoUpdate(video)}
                        className="
                          bg-[#3A86FF] text-white 
                          p-2 rounded-lg 
                          hover:bg-[#265ef0] 
                          transition duration-200 
                          flex items-center gap-2
                          cursor-pointer
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 7.5l-9 9M12 4.5h5.25a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 20.25V6.75A2.25 2.25 0 016.75 4.5H12z"
                          />
                        </svg>
                        Update
                      </li>
                      <li
                        onClick={() => handleDeleteClick(video)}
                        className="
                          bg-[#FF006E] text-white 
                          p-2 rounded-lg 
                          hover:bg-[#e6005c] 
                          transition duration-200 
                          flex items-center gap-2
                          cursor-pointer
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
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
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        videoTitle={videoToDelete ? videoToDelete.title : ""}
        videoId={video?._id}
      />
    </div>
  );
};

export default VideoCard;
