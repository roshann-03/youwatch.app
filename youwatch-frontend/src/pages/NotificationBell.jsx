import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { axiosJSON } from "@/api/axiosInstances";
import { socket } from "@/utils/socket";
import { Link } from "react-router-dom";

const NotificationBell = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUnread, setIsUnread] = useState(false);

  // Register socket and receive real-time notifications
  useEffect(() => {
    if (!currentUser?._id) return;
    socket.emit("register", currentUser?._id);

    socket.on("new-notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setIsUnread(true);
    });

    return () => {
      socket.off("new-notification");
    };
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosJSON.get(
        `${import.meta.env.VITE_APP_API_URL}/notifications`
      );
      const serverNotifs = res.data.data || [];

      setNotifications((prev) => {
        const combined = [...serverNotifs, ...prev];

        // Prevent duplicates (by _id or message fallback)
        const seen = new Set();
        return combined.filter((n) => {
          const id = n._id || n.message;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      });

      setIsUnread(res.data.data?.some((n) => !n.isRead));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (nID) => {
    try {
      await axiosJSON.post(
        `${import.meta.env.VITE_APP_API_URL}/notifications/mark-read`,
        {
          notificationId: nID,
        }
      );
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="relative focus:outline-none"
        aria-label="Notifications"
      >
        <FaBell
          size={24}
          className="text-[#1a1a1a] dark:text-[#eaeaea] hover:text-[#00ffff] dark:hover:text-[#ff00ff] transition"
        />
        {isUnread && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-[#0a0a0a] bg-[#ff2d55]" />
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-[#e5e5e5] dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] shadow-2xl z-50"
          >
            <div className="p-4 font-futuristic text-base text-[#1a1a1a] dark:text-[#eaeaea] border-b border-[#e5e5e5] dark:border-[#1a1a1a]">
              Notifications
            </div>
            <div className="divide-y divide-[#e5e5e5] dark:divide-[#1a1a1a]">
              {notifications.length === 0 ? (
                <div className="p-4 text-[#888888] dark:text-[#aaaaaa] font-exo">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    className="flex flex-wrap justify-start items-center p-2 gap-2"
                    key={n._id}
                  >
                    <Link
                      className={`block font-exo text-sm transition ${
                        !n.isRead
                          ? "text-blue-700 dark:text-[#ff00ff]"
                          : "text-[#1a1a1a] dark:text-[#eaeaea]"
                      } hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]`}
                      to={`/channel/${n.message.split(" ")[0]}`}
                      onClick={() => markAsRead(n._id)}
                    >
                      @{n.message.split(" ")[0] || "#"}
                    </Link>
                    <Link
                      to={
                        `${
                          n.type === "like" || n.type === "comment"
                            ? "/video/"
                            : "/channel/"
                        }${n.link}` || "#"
                      }
                      key={n._id || n.message}
                      className={`block font-exo text-sm transition ${
                        !n.isRead
                          ? "font-semibold text-[#2666b4] dark:text-[#c0afff]"
                          : "text-[#1a1a1a] dark:text-[#eaeaea]"
                      } hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]`}
                      onClick={() => markAsRead(n._id)}
                    >
                      {n.message.split("!")[0].split(" ").slice(1).join(" ")}
                      <span className="text-slate-500 font-normal text-lg">
                        {(() => {
                          const msg = n.message.split("!")[1];
                          return msg ? `"${msg}"` : "";
                        })()}
                      </span>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
