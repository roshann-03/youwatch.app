import { useState, useEffect } from "react";
import {
  FaCloudSun,
  FaMoon,
  FaRegSun,
  FaSun,
  FaThemeco,
  FaThemeisle,
  FaUssunnah,
} from "react-icons/fa";
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
    <>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className={`flex gap-4 group rounded-full transition-all duration-500
        ${
          isDarkMode
            ? "bg-transparent border-cyan-400 hover:border-cyan-300 shadow-sm"
            : "bg-transparent border-gray-300 hover:border-blue-400 shadow-sm"
        }
        `}
      >
        {isDarkMode ? (
          <FaSun
            className="text-yellow-200"
            // size={24}
          />
        ) : (
          <FaMoon
            className="text-gray-600 "
            // size={24}
          />
        )}
        Toggle Theme{" "}
      </button>
    </>
  );
};

export default ThemeToggle;
