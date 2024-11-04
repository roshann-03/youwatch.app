import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Auth/Login";
import UploadVideo from "./components/Videos/UploadVideo";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Register from "./components/Auth/Register";
import OtpVerification from "./components/Auth/OtpVerification";
import VideoDetail from "./components/Videos/VideoDetail";
import axios from "axios";
import "./index.css";
import ChannelMenu from "./components/ChannelMenu";
import LoggedInNav from "./components/Navbar/LoggedInNav";
import LoggedOutNav from "./components/Navbar/LoggedOutNav";
import Profile from "./components/User/Profile";
import MyVideos from "./components/User/MyVideos";
import VideoUpdateForm from "./components/Videos/UpdateVideoForm";
import SubscribedChannels from "./components/User/SubscribedChannels";

const API_URL = "http://localhost:8000/api/v1";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/logout`, null, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
        console.log("User logged out successfully");
      } else {
        console.error("Logout failed", response);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/status`, {
        withCredentials: true,
      });

      setIsLoggedIn(response.status === 200);
    } catch (error) {
      console.error("Status check error:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // UI Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? <LoggedInNav onLogout={handleLogout} /> : <LoggedOutNav />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/otp-verification"
          element={<OtpVerification onLogin={handleLogin} />}
        />
        <Route
          path="/upload"
          element={isLoggedIn ? <UploadVideo /> : <Navigate to="/login" />}
        />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/channel/:username" element={<ChannelMenu />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-videos" element={<MyVideos />} />
        <Route path="/update-video" element={<VideoUpdateForm />} />
        <Route path="/subscribed-channels" element={<SubscribedChannels />} />
      </Routes>
    </div>
  );
};

export default App;
