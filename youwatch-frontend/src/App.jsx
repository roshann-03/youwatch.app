import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { axiosJSON } from "./api/axiosInstances"; // Import your axios instances
import { AuthProvider, useAuth } from "./ContextAPI/AuthContext"; // Import context
import Dashboard from "./components/Dashboard";
import Login from "./pages/Auth/Login";
import UploadVideo from "./components/Videos/UploadVideo";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Register from "./pages/Auth/Register";
import OtpVerification from "./pages/Auth/OtpVerification";
import VideoDetail from "./components/Videos/VideoDetail";
import ChannelMenu from "./pages/ChannelMenu";
import LoggedInNav from "./components/Navbar/LoggedInNav";
import LoggedOutNav from "./components/Navbar/LoggedOutNav";
import Profile from "./pages/User/Profile";
import MyVideos from "./pages/User/MyVideos";
import VideoUpdateForm from "./components/Videos/UpdateVideoForm";
import SubscribedChannels from "./components/User/SubscribedChannels";
import Home from "./tweetapp/pages/Home";
import AllTweets from "./tweetapp/components/AllTweets";
import ResetPassword from "./pages/Auth/ResetPassword";
import MyProfile from "./pages/User/MyProfile";
import OAuthSuccess from "./pages/OAuthSuccess";
import NotFoundPage from "./pages/NotFoundPage";
import "./index.css";
import LoadingSpinner from "./components/LoadingSpinner";

// PrivateRoute to protect routes
const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// RedirectedRoute for login and register pages
const RedirectedRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isLoggedIn, login, logout } = useAuth(); // Use context to get login state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axiosJSON.post(`/users/logout`); // Changed axios call to axiosJSON
      if (response.status === 200) {
        logout();
        navigate("/login", { replace: true });
        window.history.pushState(null, "", window.location.href); // Block back navigation
        window.onpopstate = () => {
          window.history.go(1); // Block back
        };
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
      const response = await axiosJSON.get(`/users/status`); // Changed axios call to axiosJSON
      if (response.status === 200) {
        login(); // Automatically login if the status is OK
      } else {
        logout(); // If the status check fails, set the user as logged out
      }
    } catch (error) {
      console.error("Status check error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // UI Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? <LoggedInNav onLogout={handleLogout} /> : <LoggedOutNav />}

      <Routes>
        {/* Redirect logged-in users away from login and register pages */}
        <Route
          path="/register"
          element={
            <RedirectedRoute isAuthenticated={isLoggedIn}>
              <Register />
            </RedirectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectedRoute isAuthenticated={isLoggedIn}>
              <Login onLogin={handleLogin} />
            </RedirectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/otp-verification"
          element={<OtpVerification onLogin={handleLogin} />}
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <UploadVideo />
            </PrivateRoute>
          }
        />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/channel/:username" element={<ChannelMenu />} />

        {/* Secured Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/myprofile"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-videos"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <MyVideos />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-video"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <VideoUpdateForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscribed-channels"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <SubscribedChannels />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/all"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <AllTweets />
            </PrivateRoute>
          }
        />
        <Route
          path="/oauth-success"
          element={<OAuthSuccess onLogin={handleLogin} />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

const AppWithProvider = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithProvider;
