import React, { useEffect, useState } from "react";
import axios from "axios";
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
      const response = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/subscribed-channels`,
        {
          withCredentials: true,
        }
      );
      setSubscribedChannels(response.data.data);
      setSubscribedCount(response.data.data.length);
      console.log(response.data.data);
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
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.fullName}</h1>
      <p className="text-lg mb-4">
        You are subscribed to {subscribedCount} channels
      </p>
      <div className="flex flex-wrap">
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          {subscribedChannels.length === 0 ? (
            <p>No subscribed channels found.</p>
          ) : (
            <ul>
              {subscribedChannels.map((channel) => (
                <li
                  key={channel.channel._id}
                  onClick={() => {
                    navigate(`/channel/${channel?.channel?.username}`);
                  }}
                  className="cursor-pointer mb-4 p-4 border-b border-gray-700"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        channel.channel.avatar || "/default-channel-logo.png"
                      }
                      alt={channel.channel.username}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {channel.channel.username}
                      </h3>
                      <p className="text-gray-400">
                        {channel.channel.description}
                      </p>
                    </div>
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