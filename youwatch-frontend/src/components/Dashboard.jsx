import React, { useEffect, useState } from "react";
import VideoList from "../components/Videos/VideoList";
import SearchBar from "../components/Navbar/SearchBar";

const Dashboard = ({ onLogout }) => {
  return (
    <div className="flex-1 p-4 bg-black">
      <VideoList />
    </div>
  );
};

export default Dashboard;
