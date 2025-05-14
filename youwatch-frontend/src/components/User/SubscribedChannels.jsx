import { useEffect, useState } from "react";
import { axiosJSON } from "../../api/axiosInstances";
import { useNavigate } from "react-router-dom";

const SubscribedChannels = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSubscribedChannels = async () => {
    try {
      const response = await axiosJSON.get(`subscriptions/subscribed-channels`);

      setSubscribedChannels(response.data.data);
      setSubscribedCount(response.data.data.length);
    } catch (err) {
      setError("Failed to fetch subscribed channels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribedChannels();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className=" dark:bg-gradient-to-br dark:from-slate-800 dark:via-zinc-700 dark:to-gray-800    bg-gradient-to-br from-purple-200 via-pink-200 to-red-300 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold dark:text-white mb-6">
          Welcome, {user?.fullName}
        </h1>
        <p className="text-xl dark:text-white mb-8">
          You are subscribed to{" "}
          <span className="font-semibold">{subscribedCount}</span> channels
        </p>

        {/* Subscribed Channels List */}
        <div className="bg-white dark:bg-stone-800  p-6 rounded-2xl shadow-2xl">
          {subscribedChannels.length === 0 ? (
            <p className="text-center dark:text-white text-gray-500">
              No subscribed channels found.
            </p>
          ) : (
            <ul>
              {subscribedChannels.map((channel) => (
                <li
                  key={channel.channel._id}
                  onClick={() =>
                    navigate(`/channel/${channel?.channel?.username}`)
                  }
                  className="cursor-pointer mb-6 p-4 border-b dark:border-gray-600  border-gray-500 dark:hover:bg-gray-900 hover:bg-gray-200 transition-all rounded-xl"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={
                        channel.channel.avatar || "/default-channel-logo.png"
                      }
                      alt={channel.channel.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold dark:text-white text-gray-800">
                        {channel.channel.username}
                      </h3>
                      <p className="dark:text-gray-300 text-gray-500">
                        {channel.channel.description ||
                          "No description available"}
                      </p>
                    </div>
                    <button className="text-white bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full px-4 py-2 hover:bg-indigo-700 transition-all">
                      Visit Channel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
