import { useEffect, useState } from "react";
import { axiosJSON } from "../../api/axiosInstances";
import { useNavigate } from "react-router-dom";

const SubscribedChannels = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const { data } = await axiosJSON.get(
          `subscriptions/subscribed-channels`
        );
        setSubscribedChannels(data.data || []);
      } catch (err) {
        setError("Failed to fetch subscribed channels");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center animate-pulse">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const subscribedCount = subscribedChannels.length;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-red-200 dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] transition-all duration-500 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold dark:text-white mb-6 font-futuristic tracking-wider">
          Welcome, {user?.fullName || "User"}
        </h1>
        <p className="text-xl dark:text-gray-300 text-gray-800 mb-8">
          You are subscribed to{" "}
          <span className="font-semibold text-purple-700 dark:text-cyan-400">
            {subscribedCount}
          </span>{" "}
          channel{subscribedCount !== 1 ? "s" : ""}
        </p>

        {/* Channel List */}
        <div className="bg-slate-800 sm:p-6 rounded-2xl shadow-xl border dark:border-[#00ffff33] backdrop-blur-xl  w-full overflow-x-auto">
          {subscribedCount === 0 ? (
            <p className="text-center dark:text-gray-300 text-gray-500">
              No subscribed channels found.
            </p>
          ) : (
            <ul className="space-y-6">
              {subscribedChannels.map((sub) => {
                const channel = sub?.channel;
                if (!channel) return null;

                return (
                  <li
                    key={channel._id}
                    onClick={() => navigate(`/channel/${channel.username}`)}
                    className="cursor-pointer p-4 rounded-xl transition-all border dark:border-cyan-500 border-gray-300 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-cyan-500/50 hover:bg-gray-100 dark:hover:bg-[#0e0e2e] bg-white dark:bg-[#111122]"
                  >
                    <div className="flex items-center gap-6 flex-wrap break-words">
                      <img
                        src={channel.avatar || "/default-channel-logo.png"}
                        alt={channel.username || "Channel"}
                        className="w-16 h-16 rounded-full object-cover border-2 dark:border-cyan-400 border-purple-400 shadow-md"
                      />
                      <div className="flex-1 w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white font-exo">
                          {channel.username || "Unnamed Channel"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {channel.description || "No description available"}
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:from-pink-500 dark:hover:to-cyan-500 transition-all duration-100">
                        Visit Channel
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
