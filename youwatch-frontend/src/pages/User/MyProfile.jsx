import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosJSON } from "../../api/axiosInstances";

const MyProfile = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    avatar: "",
    coverImage: "",
  });
  const [subscribersCount, setSubscribersCount] = useState(0);
  const navigate = useNavigate();

  // Check for theme preference and set default to "dark"

  const fetchChannelDetails = async () => {
    try {
      const { data } = await axiosJSON.get("/users/current-user");
      const channelData = data.data;
      const channelId = channelData._id;

      const subsResponse = await axiosJSON.get(`/subscriptions/u/${channelId}`);

      setSubscribersCount(subsResponse.data.data.length);
      setUser({
        username: channelData.username || "",
        fullName: channelData.fullName || "",
        email: channelData.email || "",
        avatar: channelData.avatar || "",
        coverImage: channelData.coverImage || "",
      });
    } catch (error) {
      console.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchChannelDetails();
  }, []);

  return (
    <div className="flex dark:bg-gray-950 justify-center items-center min-h-screen lg:p-3 sm:p-3 xl:p-3 md:p-3 w-full ">
      <div className="w-full max-w-4xl dark:bg-gray-900 bg-gray-100 lg:rounded-xl sm:rounded-xl md:rounded-xl xl:rounded-xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="relative h-56 sm:h-72 dark:bg-gradient-to-t bg-gradient-to-t from-teal-100 dark:from-teal-700 to-transparent">
          <img
            src={user.coverImage || "/banner.jpg"}
            alt="Banner"
            className="w-full h-full object-cover opacity-80"
          />
          {/* Avatar */}
          <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.fullName}`
              }
              alt={user.username}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/user.webp";
              }}
              className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-cyan-400 to-purple-600 object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="pt-24 pb-8 px-6 text-center">
          <h2 className="text-4xl font-semibold dark:text-white">
            {user.fullName}
          </h2>
          <p className="text-xl text-gray-400 mt-2">@{user.username}</p>
          <p className="text-lg text-gray-500 mt-1">
            {subscribersCount} Subscribers
          </p>

          {/* Profile Details */}
          <div className="mt-6 space-y-2 text-left">
            <div className="bg-gradient-to-r from-teal-300 to-purple-400 dark:from-teal-800 dark:to-purple-900 py-3 px-2 rounded-lg shadow-xl border border-transparent transition-all duration-200">
              <span className="text-teal-600 dark:text-teal-300 text-lg">
                Email
              </span>
              <p className="dark:text-gray-200 text-xl font-medium">
                {user.email}
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-300 to-purple-400 dark:from-teal-800 dark:to-purple-900 py-3 px-2 rounded-lg shadow-xl border border-transparent transition-all duration-200">
              <span className="text-teal-600 dark:text-teal-300 text-lg">
                Username
              </span>
              <p className="dark:text-gray-200 text-xl font-medium">
                {user.username}
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-300 to-purple-400 dark:from-teal-800 dark:to-purple-900 py-3 px-2 rounded-lg shadow-xl border border-transparent transition-all duration-200">
              <span className="text-teal-600 dark:text-teal-300 text-lg">
                Full Name
              </span>
              <p className="dark:text-gray-200 text-xl font-medium">
                {user.fullName}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="mt-8 w-full sm:w-auto bg-gradient-to-r from-teal-400 to-purple-400 dark:from-teal-500 dark:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
