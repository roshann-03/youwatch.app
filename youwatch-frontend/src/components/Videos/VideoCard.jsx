import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosJSON } from "../../api/axiosInstances";
import DeleteModal from "../Modals/DeleteModal";

const VideoCard = ({ video, isOptions = false }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [videoToDelete, setVideoToDelete] = useState(null); // Video to delete
  const [openOptionsId, setOpenOptionsId] = useState(null); // Track which video's options are open
  // console.log(video);
  const optionsRef = useRef(null); // Reference for options button

  const notify = (message) => toast(message);

  // Format the time into a more readable format
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
    // Open options for the clicked video only
    if (openOptionsId === video?._id) {
      setOpenOptionsId(null); // Close options if already open
    } else {
      setOpenOptionsId(video?._id); // Open options for the clicked video
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video); // Set video to be deleted
    setIsModalOpen(true); // Show modal
  };

  const handleDeleteConfirm = async () => {
    try {
      // Call API to delete video
      await axiosJSON.delete(`/videos/${videoToDelete._id}`);
      notify("Video deleted successfully");
      // Close modal after deletion
      setIsModalOpen(false);
      // Trigger parent component's delete success handler
      // if (onDeleteSuccess) {
      //   onDeleteSuccess(videoToDelete._id);
      // }
    } catch (error) {
      console.error("Error deleting video", error);
      notify("Failed to delete video");
    }
  };

  const handleVideoUpdate = (video) => {
    navigate(`/update-video`, { state: { video } });
    setOpenOptionsId(null); // Close options after update
    notify("Video updated successfully");
  };

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOpenOptionsId(null); // Close options if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" h-full">
      <div
        className="video-card dark:bg-zinc-700 shadow-lg h-full flex flex-col w-full    rounded-xl cursor-pointer transition-all duration-300 "
        onClick={handleClick}
      >
        <div className="relative    dark:text-white ">
          <img
            className="w-full h-44 object-cover rounded-xl "
            src={video?.thumbnail}
            alt={video?.title}
          />
          <h3 className="font-medium text-sm absolute bottom-1 right-1 text-white bg-black bg-opacity-65 px-2 rounded">
            {Math.floor(video?.duration / 60)}:
            {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
          </h3>
        </div>

        <div className="flex items-start gap-2 p-2 ">
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
            <h3 className="font-medium break-words dark:text-white text-black">
              {videoTitleTruncate(video?.title)}
            </h3>
            <p className="dark:text-gray-200 text-gray-600 text-sm">
              @{video?.owner?.name || video?.owner?.username}
            </p>
            <p className="text-sm font-medium dark:text-white text-gray-600">
              {video?.views} views • {timeAgo(video?.createdAt)}
            </p>

            {isOptions && (
              <div
                onClick={(e) => handleOptions(e)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                // ref={optionsRef}
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
                  <div className="absolute z-50 right-6 top-0 rounded-lg bg-gray-50  border-gray-400 p-3 shadow-lg">
                    <ul className="w-full space-y-2">
                      <li
                        onClick={() => handleVideoUpdate(video)}
                        className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-700 transition duration-200 flex items-center gap-2"
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
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-200 flex items-center gap-2"
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
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onConfirm={handleDeleteConfirm} // Handle confirmation
        videoTitle={videoToDelete ? videoToDelete.title : ""} // Pass video title to modal
      />
    </div>
  );
};

export default VideoCard;
