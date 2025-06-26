import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#070f20] bg-opacity-80 transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Futuristic Glitch Logo */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-widest
          text-transparent bg-clip-text bg-gradient-to-r 
          darfrom-cyan-400 darvia-fuchsia-500 darto-blue-500
          animate-gradient-glow select-none"
        >
          YouWatch
        </h1>

        {/* Bouncing dots with futuristic glow in dark mode */}
        <div className="flex space-x-3">
          <div className="h-4 w-4 bg-cyan-300 rounded-full animate-bounce delay-100 shadow-[0_0_8px_#00ffff]"></div>
          <div className="h-4 w-4 bg-fuchsia-400 rounded-full animate-bounce delay-200 shadow-[0_0_8px_#ff00ff]"></div>
          <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce delay-300 shadow-[0_0_8px_#0099ff]"></div>
        </div>

        {/* Loading Text */}
        <p className="text-cyan-200 text-lg sm:text-xl font-medium animate-pulse tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
