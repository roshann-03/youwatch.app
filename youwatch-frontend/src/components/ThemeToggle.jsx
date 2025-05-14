import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check the theme in localStorage on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark"); // Enable dark mode
      } else {
        document.documentElement.classList.remove("dark"); // Disable dark mode
      }
    } else {
      // Default to light theme
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);

    // Apply the theme class to the root element
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 border border-gray-800  bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {/* Replace emojis with React icons */}
      {isDarkMode ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
