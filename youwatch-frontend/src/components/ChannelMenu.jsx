import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Subscription from "./User/Subscription";

const ChannelMenu = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status
  const [currentUser, setCurrentUser] = useState(null);

  const { username } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api/v1";

  // Function to fetch channel details
  const fetchChannelDetails = async () => {
    try {
      const [channelResponse, currentUserResponse] = await Promise.all([
        axios.get(`${API_URL}/users/c/${username}`, { withCredentials: true }),
        axios.get(`${API_URL}/users/current-user`, { withCredentials: true }),
      ]);

      const channelData = channelResponse.data.data;
      setChannel(channelData);
      setSubscriberCount(channelData.subscribersCount);
      setIsSubscribed(channelData.isSubscribed);
      setCurrentUser(currentUserResponse.data.data);

      const videosResponse = await axios.get(
        `${API_URL}/videos/c/${channelData._id}`,
        { withCredentials: true }
      );
      setVideos(videosResponse.data.data);
    } catch (err) {
      setError("Failed to fetch channel details or videos");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch channel details on username change
  useEffect(() => {
    fetchChannelDetails();
  }, [username]);

  // Handle subscribe/unsubscribe actions
  const handleSubscribe = async () => {
    try {
      await axios.post(
        `${API_URL}/subscriptions/c/${channel?._id}`,
        {},
        { withCredentials: true }
      );
      setIsSubscribed(!isSubscribed); // Toggle subscription status
      fetchChannelDetails(); // Re-fetch to update the subscriber count
    } catch (err) {
      console.error("Error toggling subscription", err);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!channel) return <div className="text-center">Channel not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-5 bg-white rounded-lg shadow-md">
      {/* Channel Details */}
      <div className="mb-6 border border-gray-800 flex flex-col gap-5">
        <div className="w-full h-44">
          <img
            src={channel?.coverImage}
            alt={channel?.username}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-4 flex items-center gap-4">
          <img
            src={channel.avatar || channel?.snippet?.thumbnails?.high?.url}
            alt={channel.username}
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              @{channel?.username}
              <span className="text-xl font-medium text-gray-500">
                • {subscriberCount} subscriber{subscriberCount !== 1 && "s"}
              </span>
            </h2>
            <p className="mt-1 text-gray-700">{channel?.fullName}</p>
          </div>

          {currentUser?._id !== channel?._id && (
            <button
              onClick={handleSubscribe}
              className={`py-2 px-4 rounded-full text-white ${
                isSubscribed ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* Videos Section */}
      <h3 className="text-2xl font-semibold mb-4">Latest Videos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.length === 0 && <p>No videos found</p>}
        {videos.map((video) => (
          <div
            key={video?._id}
            className="bg-gray-100 rounded-lg overflow-hidden shadow"
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/video/${video?._id}`)}
            >
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className="w-full h-auto"
              />
              <div className="p-3">
                <h4 className="font-semibold">{video?.title}</h4>
                <p className="text-gray-600">
                  {new Date(video?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelMenu;
