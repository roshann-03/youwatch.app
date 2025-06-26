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

      const videosResponse = await axiosJSON.get(`/videos/c/${channelData._id}`);
      setVideos(videosResponse.data.data);
    } catch (err) {
      setError("Failed to fetch channel details or videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelDetails();
  }, [username]);

  const handleSubscribe = async () => {
    try {
      await axiosJSON.post(`/subscriptions/c/${channel?._id}`);
      setIsSubscribed(!isSubscribed);
      fetchChannelDetails();
    } catch (err) {
      console.error("Error toggling subscription", err);
    }
  };

  if (loading) return <div className="text-center text-lg dark:text-white">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!channel) return <div className="text-center text-lg dark:text-white">Channel not found</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#0a0f1c] dark:to-[#111827] transition-all px-4 py-8">
      {/* Cover background blur (optional) */}
      <div className="absolute inset-0 z-0 opacity-10 blur-sm hidden dark:block">
        <img
          src={channel?.coverImage ?? "/banner.jpg"}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Channel Info Card */}
        <div className="rounded-2xl p-8 bg-white/90 dark:bg-black/70 backdrop-blur-md border dark:border-cyan-500 border-gray-300 shadow-xl dark:shadow-[0_0_30px_#00FFF7]">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <img
              src={channel.avatar || channel?.snippet?.thumbnails?.high?.url}
              alt={channel.username}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-cyan-400 shadow-lg"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h2 className="text-4xl font-bold tracking-wide text-gray-800 dark:text-white dark:font-futuristic">
                @{channel.username}
                <span className="ml-3 text-xl text-gray-600 dark:text-cyan-400">
                  • {subscriberCount} subscriber{subscriberCount !== 1 && "s"}
                </span>
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {channel.fullName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {channel.bio || "No bio available."}
              </p>

              {currentUser?._id !== channel?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`mt-4 px-6 py-2 text-lg font-semibold rounded-full transition-all ${
                    isSubscribed
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } shadow-md`}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <h3 className="text-3xl font-bold mb-6 dark:text-white border-b border-gray-300 dark:border-cyan-500 pb-2 w-fit dark:font-futuristic">
            🎥 Latest Videos
          </h3>

          {videos.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video?._id}
                  className="bg-white dark:bg-black/80 border dark:border-cyan-400 border-gray-300 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-[0_0_20px_#00fff7] transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/video/${video?._id}`)}
                >
                  <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {video?.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(video?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelMenu;
