import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoList from "./VideoList";
import CommentSection from "../CommentSection";
import Subscription from "../User/Subscription";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { axiosJSON } from "../../api/axiosInstances";
import CustomVideoPlayer from "./CustomVideoPlayer.jsx";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Check if user liked the video
  const handleLikedStatus = async (videoId) => {
    try {
      const response = await axiosJSON.get(`likes/videos`, {
        withCredentials: true,
      });
      if (response?.data?.data?.length > 0) {
        const isLikedVideo = response.data.data.some(
          (like) => like.video?._id === videoId
        );
        setIsLiked(isLikedVideo);
        if (isLikedVideo) setIsDisliked(false);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch likes count
  const fetchVideoLikes = async () => {
    try {
      const response = await axiosJSON.get(`/videos/likes/${id}`);
      setLikesCount(response?.data.data.likes);
    } catch (error) {
      console.error("Error fetching video likes:", error);
    }
  };

  // Toggle like
  const toggleLike = async (videoId) => {
    try {
      const response = await axiosJSON.post(`likes/toggle/v/${videoId}`, {
        userId: video.owner._id,
      });
      fetchVideoLikes();
      if (response?.data?.data === null) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Like button handler
  const handleLike = () => toggleLike(id);

  // Dislike button handler
  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      if (isLiked) setIsLiked(false);
      setIsDisliked(true);
    }
  };

  // Format likes count display
  const formatLikes = (likes) => {
    if (!likes) return "";
    if (likes < 1000) return likes;
    const units = ["k", "m", "b", "t"];
    const index = Math.floor(Math.log10(likes) / 3);
    const formatted = (likes / Math.pow(1000, index)).toFixed(1);
    return `${formatted}${units[index - 1]}`;
  };

  // Format subscriber count
  const formatSubscriberCount = (count) => {
    if (count === 1) return "1 subscriber";
    if (count < 1000) return `${count} subscribers`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k subscribers`;
    return `${(count / 1000000).toFixed(1)}m subscribers`;
  };

  // Time ago formatter
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

  // Fetch video details and likes on mount or id change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchVideoDetails = async () => {
      try {
        const response = await axiosJSON.get(`videos/${id}`);
        if (isMounted) setVideo(response?.data.data);
      } catch {
        if (isMounted) setError("Failed to fetch video details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideoDetails();
    handleLikedStatus(id);
    fetchVideoLikes();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 p-10">{error}</div>;
  if (!video) return <div className="text-center p-10">No video found.</div>;

  const handleChannel = () => {
    const username = video?.owner?.name;
    navigate(`/channel/${username}`);
  };

  const loadMoreDescription = () => setIsDescriptionOpen((prev) => !prev);

  return (
    <div className="flex flex-col w-full justify-center items-center dark:bg-black dark:text-gray-50 bg-white text-gray-900 transition-colors duration-500 ">
      <div className="relative w-full ">
        <div className="video-container flex justify-center  w-full dark:bg-black relative ">
          <CustomVideoPlayer video={video} />
        </div>

        <h1 className="text-2xl font-semibold px-5 mt-4 dark:text-cyan-300">
          {video?.title}
        </h1>

        <div className="flex items-center px-5 mt-4 gap-10 cursor-pointer w-full flex-wrap">
          <div className="flex items-center" onClick={handleChannel}>
            {video?.owner?.avatar && (
              <img
                src={video.owner.avatar}
                alt={`${video.owner.name}'s avatar`}
                className="w-10 h-10 rounded-full mr-3 border-2 border-transparent dark:border-cyan-400 transition-colors duration-300"
              />
            )}
            <div className="flex flex-col items-start">
              <p className="font-semibold text-lg dark:text-cyan-300">
                @{video.owner.name}
              </p>
              <p className="text-sm dark:text-cyan-400">
                {formatSubscriberCount(video.subscriberCount)}
              </p>
            </div>
          </div>

          <Subscription channelId={video?.owner?._id} />

          <div className="likes-container flex items-center gap-4 bg-zinc-200 dark:bg-zinc-900 px-6 py-3 rounded-3xl ">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 font-semibold text-sm transition-colors duration-300 ${
                isLiked ? "text-cyan-400" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {isLiked ? (
                <BiSolidLike className="w-6 h-6" />
              ) : (
                <BiLike className="w-6 h-6" />
              )}
              {formatLikes(likesCount)}
            </button>

            <span className="h-full w-[1px] bg-gray-400 dark:bg-cyan-600">
              &nbsp;
            </span>

            <button
              type="button"
              onClick={handleDislike}
              className={`flex items-center gap-2 font-semibold text-sm transition-colors duration-300 ${
                isDisliked ? "text-red-500" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {isDisliked ? (
                <BiSolidDislike className="w-6 h-6" />
              ) : (
                <BiDislike className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="justify-between items-center m-5 bg-gray-100 dark:bg-[#111827] rounded-xl p-5 text-gray-900 dark:text-cyan-300  ">
          <div className="mb-2">
            {video.views} views • {timeAgo(video.createdAt)}
          </div>

          {isDescriptionOpen ? (
            <>
              <p className="whitespace-pre-wrap">{video.description}</p>
              <button
                className="mt-2 text-cyan-400 hover:text-cyan-600 font-semibold"
                onClick={loadMoreDescription}
              >
                See less
              </button>
            </>
          ) : (
            <button
              className="text-cyan-400 hover:text-cyan-600 font-semibold"
              onClick={loadMoreDescription}
            >
              ...more
            </button>
          )}
        </div>

        <CommentSection owner={video.owner} />
      </div>

      <h1 className="text-2xl font-bold text-left border-t-2 border-gray-300 dark:border-cyan-600 p-5 w-full max-w-6xl dark:text-cyan-300 tracking-wide">
        More Videos
      </h1>

      <VideoList />
    </div>
  );
};

export default VideoDetail;
