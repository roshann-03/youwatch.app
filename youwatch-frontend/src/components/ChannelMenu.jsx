import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Subscription from "./User/Subscription";

const ChannelMenu = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const channelResponse = await axios.get(
          `${API_URL}/users/c/${username}`,
          { withCredentials: true }
        );

        setChannel(channelResponse.data.data);

        const videosResponse = await axios.get(
          `${API_URL}/videos/c/${channelResponse.data.data._id}`,
          { withCredentials: true }
        );
        setVideos(videosResponse.data.data);
      } catch (err) {
        setError("Failed to fetch channel details or videos");
      } finally {
        setLoading(false);
      }
    };
    fetchChannelDetails();
  }, [username]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!channel) return <div className="text-center">Channel not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-5 bg-white rounded-lg shadow-md">
      {/* Channel Details */}
      <div className="mb-6 border border-gray-800 flex flex-col justify-between gap-5">
        <div className="w-full h-44">
          <img
            src={channel?.coverImage}
            alt={channel?.username}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="ml-4 flex items-center gap-4">
            <img
              src={channel.avatar || channel?.snippet.thumbnails.high.url}
              alt={channel.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h2 className="text-3xl font-bold">{channel?.username}</h2>
              <p className="mt-2 text-gray-700">{channel?.fullName}</p>
            </div>
            <Subscription channelId={channel?._id} />
          </div>
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
