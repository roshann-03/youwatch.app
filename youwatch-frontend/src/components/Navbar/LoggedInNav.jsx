import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "../ThemeToggle";
import {
  FaUser,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaHome,
  FaVideo,
  FaUpload,
  FaStream,
  FaNewspaper,
} from "react-icons/fa";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { RiStickyNoteAddFill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const LoggedInNav = ({ onLogout, collapsed, setCollapsed }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      if (!collapsed) setCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

  const handleRoute = (path) => {
    navigate(path);
    setCollapsed(true);
  };

  const menuItems = [
    { label: "Home", path: "/", icon: <FaHome /> },
    { label: "Trending", path: "/trending", icon: <FaStream /> },
    { label: "Subscriptions", path: "/subscribed-channels", icon: <FaUser /> },
    { label: "Upload Video", path: "/upload", icon: <FaUpload /> },
    { label: "My Videos", path: "/my-videos", icon: <FaVideo /> },
    { label: "Posts", path: "/posts/all", icon: <FaNewspaper /> },
    { label: "My Posts", path: "/posts", icon: <RiStickyNoteAddFill /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <div ref={sidebarRef} className="w-full">
        <aside
          className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] z-40 bg-[#F8FAFC] dark:bg-[#0a0f1c] text-[#0f172a] dark:text-[#F1F5F9] shadow-xl transition-all duration-300 border-r border-[#E5E7EB] dark:border-[#1f2937] font-sans dark:font-futuristic  ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex justify-end mr-3 p-2 ">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-2xl sidebar-toggle hover:scale-110 transition-transform"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
            </button>
          </div>

          <div className="flex flex-col px-2 pt-2 space-y-1 overflow-y-auto custom-scrollbar max-h-[calc(100%-100px)] overflow-x-hidden">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleRoute(item.path)}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-[#CBD5E1] dark:hover:bg-[#1e293b] transition-all justify-start gap-3`}
              >
                {item.icon}
                {!collapsed && (
                  <span className="text-sm font-medium text-[#2d333e] dark:text-[#00FFF7] text-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Top Navbar */}
      <header className="w-full h-16 bg-[#F8FAFC] text-[#0f172a] dark:bg-[#0a0f1c] dark:text-[#F1F5F9] px-3 lg:px-4 sticky top-0 z-50 flex items-center justify-between transition-all border-b border-[#E5E7EB] dark:border-[#1f2937]">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-14 rounded-lg overflow-hidden">
              <img
                src="/logo.jpg"
                alt="YouWatch Logo"
                className="h-full w-full dark:hidden object-cover rounded-lg"
              />
              <img
                src="/logo-dark.jpg"
                alt="YouWatch Logo"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <span className="hidden md:block font-bold text-xl dark:text-[#00FFF7] tracking-wide font-futuristic text-gray-800 ">
              YouWatch
            </span>
          </Link>
        </div>

        <div className="flex-1 px-4 max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4 mr-5">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none group">
                <Avatar className="w-9 h-9 border-2 border-[#3A86FF] dark:border-[#00FFF7] shadow-md group-hover:scale-105 transition-transform">
                  <AvatarImage src={user?.avatar || "/user.webp"} />
                  <AvatarFallback>
                    {user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline font-medium text-sm text-[#475569] dark:text-[#F1F5F9] group-hover:text-[#0f172a] dark:group-hover:text-cyan-100 transition underline">
                  {user?.username || "User"}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 mt-2 rounded-xl shadow-xl border border-[#E5E7EB] dark:border-[#1f2937] bg-[#E2E8F0] dark:bg-[#111827] text-[#0f172a] dark:text-slate-100">
              <DropdownMenuItem onClick={() => handleRoute("/myprofile")}>
                {" "}
                <FaUser className="mr-2 text-[#2d333e] dark:text-[#00FFF7]" />{" "}
                Profile{" "}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoute("/profile")}>
                {" "}
                <FaCog className="mr-2 text-[#2d333e] dark:text-[#00FFF7]" />{" "}
                Settings{" "}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoute("/notifications")}>
                {" "}
                <FaBell className="mr-2 text-[#2d333e] dark:text-[#00FFF7]" />{" "}
                Notifications{" "}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                {" "}
                <FaSignOutAlt className="mr-2 text-[rgb(233,54,80)] dark:text-[#FF00A8]" />{" "}
                Logout{" "}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default LoggedInNav;
