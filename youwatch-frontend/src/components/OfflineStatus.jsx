import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{isOnline ? <Navigate to="/" /> : "You are Offline"}</h1>
      {!isOnline && (
        <p style={{ color: "red" }}>
          It seems you are offline. Please check your internet connection.
        </p>
      )}
    </div>
  );
};

export default OfflineStatus;
