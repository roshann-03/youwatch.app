import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import BackButton from "../Buttons/BackButton";
import ForwardButton from "../Buttons/ForwardButton";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing react icons for Hamburger and Close
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../ContextAPI/AuthContext";

const LoggedInNav = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  // Fetch user data from localStorage
  const fetchUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleRoute = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close sidebar after navigating
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        setSidebarOpen(false); // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="sticky top-0 z-20 ">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } dark:bg-gradient-to-b from-gray-800 to-black bg-white dark:text-white w-64  overflow-y-auto custom-scrollbar`}
      >
        <div className="flex justify-end pt-3 pr-3">
          <FaTimes
            className="dark:text-white text-xl mr-2 mt-5 -mb-5 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
        <ul className="flex mt-8 flex-col space-y-3 px-6 ">
          {[
            { label: "Home", path: "/" },
            { label: "Trending", path: "/" },
            { label: "Subscriptions", path: "/subscribed-channels" },
            { label: "Upload Video", path: "/upload" },
            { label: "My Videos", path: "/my-videos" },
            { label: "Posts", path: "/posts/all" },
            { label: "My Posts", path: "/posts" },
            { label: "Logout", path: "/logout", isLogout: true },
          ].map((item) => (
            <li
              key={item.label}
              className="cursor-pointer flex items-center gap-2 dark:hover:text-gray-400  hover:bg-gray-700 hover:text-gray-300 px-4 py-2 rounded-lg transition-all duration-300"
              onClick={() =>
                item.isLogout ? onLogout() : handleRoute(item.path)
              }
            >
              <span className="group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Navigation */}
      <nav className="dark:bg-gradient-to-b from-gray-800 to-black bg-white dark:text-white pt-4 pb-3 px-6 flex justify-between items-center shadow-lg w-full overflow-hidden">
        <div className="flex items-center gap-4">
          {/* Menu Button to open sidebar (always visible on all screen sizes) */}
          <FaBars
            onClick={toggleSidebar}
            className="dark:text-white text-2xl cursor-pointer"
          />

          {/* Back and Forward Buttons */}
          <div className="gap-1 hidden sm:flex md:flex lg:flex xl:flex">
            <BackButton onClick={() => navigate(-1)} />
            <ForwardButton onClick={() => navigate(1)} />
          </div>

          {/* Logo */}
          <Link to="/" className=" items-center gap-2 flex">
            <div className="h-10 w-42 rounded-lg overflow-hidden">
              <img
                src="/logo3.png"
                alt="YouWatch Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8 w-fit">
          <SearchBar />
        </div>

        {/* User Profile */}
        <div className="relative flex gap-2 items-center">
          <ThemeToggle />

          <Link to="/myprofile" className="text-white hover:text-blue-300">
            <div className="w-14 h-14 border-2 border-blue-500 rounded-full overflow-hidden">
              <img
                src={user?.avatar || "/user.webp"}
                alt={user?.username || "User"}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default LoggedInNav;
