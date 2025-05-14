// pages/OAuthSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Optionally fetch user info here
      onLogin();
      navigate("/");
    } else {
      navigate("/login", { state: { message: "Login failed." } });
    }
  }, [navigate, onLogin]);

  return (
    <div className="h-screen flex justify-center items-center text-white bg-black">
      Logging in with Google...
    </div>
  );
};

export default OAuthSuccess;
