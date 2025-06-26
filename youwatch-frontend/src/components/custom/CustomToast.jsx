import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const CustomToast = () => {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    // Watch for class changes on the <html> tag
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect(); // Clean up on unmount
  }, []);

  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      closeButton
      toastClassName={`rounded-md px-4 py-3 shadow-md font-medium transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#0a0f1c] text-cyan-300 border border-cyan-500 font-futuristic shadow-[0_0_12px_#00FFF7]"
          : "bg-white text-gray-900"
      }`}
      bodyClassName="flex-1 text-sm font-medium"
      progressClassName={theme === "dark" ? "bg-cyan-400" : "bg-red-500"}
    />
  );
};

export default CustomToast;
