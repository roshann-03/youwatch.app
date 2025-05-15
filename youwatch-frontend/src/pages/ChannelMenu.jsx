import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosJSON } from "../api/axiosInstances";

const ChannelMenu = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { username } = useParams();
  const navigate = useNavigate();

  // Function to fetch channel details
  const fetchChannelDetails = async () => {
    try {
      const [channelResponse, currentUserResponse] = await Promise.all([
        axiosJSON.get(`/users/c/${username}`),
        axiosJSON.get(`/users/current-user`),
      ]);

      const channelData = channelResponse.data.data;
      setChannel(channelData);
      setSubscriberCount(channelData.subscribersCount);
      setIsSubscribed(channelData.isSubscribed);
      setCurrentUser(currentUserResponse.data.data);

      const videosResponse = await axiosJSON.get(
        `/videos/c/${channelData._id}`
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
      await axiosJSON.post(`/subscriptions/c/${channel?._id}`);
      setIsSubscribed(!isSubscribed); // Toggle subscription status
      fetchChannelDetails(); // Re-fetch to update the subscriber count
    } catch (err) {
      console.error("Error toggling subscription", err);
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500  text-center">{error}</div>;
  if (!channel)
    return <div className="text-center text-lg">Channel not found</div>;

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen">
      <div className=" mx-auto bg-rose-100 shadow-2xl space-y-12  z-10 relative">
        {/* Channel Details */}
        <div
          className=" flex flex-col sm:flex-row items-center gap-8  rounded-xl p-8"
          style={{
            backgroundImage: `url(${channel.coverImage}), linear-gradient(to right, rgba(255, 19, 71, 0.3), rgba(255, 105, 180, 0.7))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="flex flex-col items-center sm:items-start sm:w-2/3 space-y-6">
            <img
              src={channel.avatar || channel?.snippet?.thumbnails?.high?.url}
              alt={channel.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-semibold text-gray-100">
                @{channel?.username}
                <span className="text-xl text-gray-200 ml-2">
                  • {subscriberCount} subscriber{subscriberCount !== 1 && "s"}
                </span>
              </h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="mt-2 text-lg text-gray-300">
                    {channel?.fullName}
                  </p>
                  <p className="mt-1 text-gray-400">
                    {channel?.bio || "No bio available."}
                  </p>
                </div>

                {/* Subscribe Button */}
                {currentUser?._id !== channel?._id && (
                  <button
                    onClick={handleSubscribe}
                    className={`h-12 rounded-full px-6 transition-all ${
                      isSubscribed
                        ? "bg-red-900 hover:bg-red-800 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <h3 className="text-3xl font-semibold px-2">Latest Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 p-2">
          {videos.length === 0 && (
            <p className="text-gray-600">No videos found</p>
          )}
          {videos.map((video) => (
            <div
              key={video?._id}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/video/${video?._id}`)}
              >
                <img
                  src={video?.thumbnail}
                  alt={video?.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {video?.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(video?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cover Image */}
      <div className="w-full absolute top-0 left-0 z-0">
        <img
          src={channel?.coverImage ?? "/banner.jpg"}
          alt={channel?.username}
          className="w-full h-64 object-cover shadow-lg"
        />
      </div>
    </div>
  );
};

export default ChannelMenu;
