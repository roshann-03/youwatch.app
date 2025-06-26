import { useState, useEffect } from "react";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme === "dark";
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`group p-3 rounded-full border-2 transition-all duration-500
        ${
          isDarkMode
            ? "bg-black border-cyan-400 hover:border-cyan-300 shadow-[0_0_12px_#00FFF7]"
            : "bg-white border-gray-300 hover:border-blue-400 shadow-sm"
        }
      `}
    >
      {isDarkMode ? (
        <RiSunFill
          className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
          size={24}
        />
      ) : (
        <RiMoonClearFill
          className="text-blue-700 group-hover:scale-110 transition-transform duration-300"
          size={24}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
