import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FaWifi, FaWifiSlash } from "react-icons/fa"; // Import icons for online/offline status

const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    // Add event listeners for online and offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-700 via-purple-800 to-indigo-900 text-white p-6 transition-all"
    >
      <div className="text-center bg-gray-800 rounded-xl p-8 shadow-lg max-w-lg w-full">
        {isOnline ? (
          <Navigate to="/" />
        ) : (
          <>
            <div className="mb-4">
              <FaWifiSlash size={60} className="text-red-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-semibold text-red-600 mb-4">You are Offline</h1>
            <p className="text-lg text-gray-300">
              It seems you are offline. Please check your internet connection.
            </p>
          </>
        )}
        {/* Add smooth animation for offline notice */}
        <div className="mt-6">
          {!isOnline && (
            <button
              onClick={() => window.location.reload()} // Simple reload button to recheck connection
              className="py-2 px-6 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineStatus;
