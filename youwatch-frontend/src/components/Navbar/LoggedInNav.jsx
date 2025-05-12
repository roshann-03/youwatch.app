// src/components/LoggedInNav.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
const LoggedInNav = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleRoute = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="sticky top-0 z-10">
      <div
        className={`fixed top-0 left-0 h-[calc(100%-60px)] z-10 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-black text-white`}
      >
        <ul className="flex mt-[60px] flex-col h-full w-60 bg-black text-white p-5">
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/")}
          >
            Home
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/")}
          >
            Trending
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/subscribed-channels")}
          >
            Subscriptions
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/upload")}
          >
            Upload Video
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/my-videos")}
          >
            My Videos
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/posts/all")}
          >
            Posts
          </li>
          <li
            className="cursor-pointer mb-2 hover:bg-gray-700 p-2 rounded"
            onClick={() => handleRoute("/posts")}
          >
            My Posts
          </li>
          <li
            className="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
            onClick={() => onLogout()}
          >
            Logout
          </li>
        </ul>
      </div>

      <nav className="bg-black relative  z-10 pt-5 pb-2  px-5 flex justify-between items-center">
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={toggleSidebar}
            className="block text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link to="/">
            <div className="logo-container flex justify-center items-center">
              <div className="logo h-10 w-14 rounded-lg flex justify-center items-center object-center object-cover">
                <img
                  src={`/logo.jpg`}
                  alt=""
                  className="h-full w-full rounded-lg"
                />
              </div>
              <h1 className="text-white font-bold text-xl ml-2">YouWatch</h1>
            </div>
          </Link>
        </div>

        <SearchBar />

        <div className="profile">
          <Link to="/myprofile" className="text-white hover:text-blue-200">
            <div className="w-12 h-12">
              <img
                src={`${user?.avatar}`}
                alt=""
                className="h-full w-full rounded-full object-cover object-center"
              />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default LoggedInNav;
