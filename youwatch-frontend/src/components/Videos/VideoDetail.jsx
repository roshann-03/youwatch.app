import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoList from "./VideoList";
import CommentSection from "../CommentSection";
import Subscription from "../User/Subscription";
import { BiLike, BiDislike } from "react-icons/bi";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  const API_URL = `http://localhost:8000/api/v1/likes`;

  const handleLikedStatus = async (videoId) => {
    try {
      const response = await axios.get(`${API_URL}/videos`, {
        withCredentials: true,
      });
      if (response?.data?.data?.length > 0) {
        const isLikedVideo = response.data.data.some(
          (like) => like.video?._id === videoId
        );
        if (isLikedVideo) {
          setIsLiked(true);
          setIsDisliked(false);
          return;
        } else {
          setIsLiked(false);
          return;
        }
      } else {
        setIsLiked(false);

        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleLikedStatus(id);
  }, []);

  const fetchVideoLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/videos/likes/${id}`,
        { withCredentials: true }
      );
      setLikesCount(response?.data.data.likes);
    } catch (error) {
      console.error("Error fetching video likes:", error);
    }
  };

  useEffect(() => {
    fetchVideoLikes();
  }, []);

  const toggleLike = async (videoId) => {
    try {
      const response = await axios.post(
        `${API_URL}/toggle/v/${videoId}`,
        null,
        {
          withCredentials: true,
        }
      );

      fetchVideoLikes();

      if (response?.data?.data === null) {
        setIsLiked(false);
        return;
      } else {
        setIsLiked(true);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleLike = () => {
    toggleLike(id);
    if (isLiked) {
      setIsLiked(false);
    } else {
      if (isDisliked) {
        setIsDisliked(false);
      }
      setIsLiked(true);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      if (isLiked) {
        setIsLiked(false);
      }
      setIsDisliked(true);
    }
  };

  const formatLikes = (likes) => {
    if (likes === 0) return "";
    if (likes < 1000) return likes;
    const units = ["k", "m", "b", "t"];
    const index = Math.floor(Math.log10(likes) / 3);
    const formattedLikes = (likes / Math.pow(1000, index)).toFixed(1);
    return `${formattedLikes}${units[index - 1]}`;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/videos/${id}`,
          { withCredentials: true }
        );
        setVideo(response?.data.data);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Failed to fetch video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!video) return <div>No video found.</div>;

  const handleChannel = () => {
    const username = video?.owner?.name;
    navigate(`/channel/${username}`);
  };

  const loadMoreDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen); // Toggle description visibility
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const formatSubscriberCount = (count) => {
    if (count >= 1) return `${count} subscriber`;
    if (count < 1000) return `${count} subscribers`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k subscribers`;
    return `${(count / 1000000).toFixed(1)}m subscribers`;
  };

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

  return (
    <div className="flex flex-col w-full justify-center items-center bg-black text-gray-50">
      <div className="relative w-full">
        <div className="video-container flex justify-center w-full bg-black relative">
          <video
            controls
            className="w-full max-h-[80vh] h-auto rounded-xl bg-black"
            src={video.videoFile}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>

        <h1 className="text-2xl font-semibold px-5 mt-2">{video?.title}</h1>
        <div className="flex items-center px-5 mt-2 gap-10 cursor-pointer w-full">
          <div className="flex items-center gap-10">
            <div className="flex items-center" onClick={handleChannel}>
              {video?.owner?.avatar && (
                <img
                  src={video?.owner?.avatar}
                  alt={`${video?.owner?.name}'s avatar`}
                  className="w-10 h-10 rounded-full mr-2"
                />
              )}
              <div className="flex flex-col items-start">
                <p className="font-semibold text-lg">@{video?.owner?.name}</p>
                <p className="text-md">
                  {formatSubscriberCount(video?.subscriberCount)}
                </p>
              </div>
            </div>
            <Subscription channelId={video?.owner?._id} />
            <div className="likes-container flex items-center justify-center gap-3 bg-zinc-700 px-5 py-2 rounded-3xl">
              <button type="button" className="like" onClick={handleLike}>
                <p className="flex gap-2 font-semibold font-[inter] text-sm items-center">
                  {isLiked ? (
                    <BiSolidLike
                      style={{ color: "white", height: "25px", width: "25px" }}
                    />
                  ) : (
                    <BiLike
                      style={{ color: "white", height: "25px", width: "25px" }}
                    />
                  )}
                  {formatLikes(likesCount)}
                </p>
              </button>
              <p className="h-full w-[1px] bg-zinc-400">&nbsp;</p>
              <button type="button" className="like" onClick={handleDislike}>
                {isDisliked ? (
                  <BiSolidDislike
                    style={{ color: "white", height: "25px", width: "25px" }}
                  />
                ) : (
                  <BiDislike
                    style={{ color: "white", height: "25px", width: "25px" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="justify-between items-center m-5 bg-zinc-700 rounded-xl p-5">
          <div>
            {video?.views} views • {timeAgo(video?.createdAt)}
          </div>
          {isDescriptionOpen ? (
            <>
              <p>{video.description}</p>
              <button className="text-zinc-300" onClick={loadMoreDescription}>
                see less
              </button>
            </>
          ) : (
            <button className="text-zinc-300" onClick={loadMoreDescription}>
              ...more
            </button>
          )}
        </div>

        <CommentSection />
      </div>

      <h1 className="text-2xl font-bold text-left flex justify-start border-t-2 border-gray-300 p-5 w-full">
        More Videos
      </h1>
      <VideoList />
    </div>
  );
};

export default VideoDetail;
