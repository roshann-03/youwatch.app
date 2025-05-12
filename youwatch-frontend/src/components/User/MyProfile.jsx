import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    avatar: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        username: storedUser.username || "",
        fullName: storedUser.fullName || "",
        email: storedUser.email || "",
        avatar: storedUser.avatar || "",
      });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={
              user.avatar || "https://ui-avatars.com/api/?name=" + user.fullName
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <h2 className="text-2xl font-semibold mt-4">{user.fullName}</h2>
          <p className="text-gray-400">@{user.username}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="bg-gray-700 p-3 rounded-lg">
            <span className="text-gray-400 text-sm">Email</span>
            <p className="text-white font-medium">{user.email}</p>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <span className="text-gray-400 text-sm">Username</span>
            <p className="text-white font-medium">{user.username}</p>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <span className="text-gray-400 text-sm">Full Name</span>
            <p className="text-white font-medium">{user.fullName}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
