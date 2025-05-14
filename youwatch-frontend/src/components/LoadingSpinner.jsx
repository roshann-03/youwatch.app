import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen z-10 dark:bg-black bg-opacity-80">
      <div className="flex flex-col items-center">
        {/* Animated Text */}
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 animate-gradient   dark:bg-gradient-to-r dark:from-gray-300 dark:via-gray-400 dark:to-gray-500 animate-gradient">
          YouWatch
        </h1>

        {/* Bouncing dots animation */}
        <div className="mt-4 flex space-x-2">
          <div className="h-4 w-4 dark:bg-white bg-black rounded-full animate-bounce delay-200"></div>
          <div className="h-4 w-4 dark:bg-white bg-black rounded-full animate-bounce delay-300"></div>
          <div className="h-4 w-4 dark:bg-white  bg-black rounded-full animate-bounce delay-400"></div>
        </div>

        {/* Loading text with pulsating effect */}
        <p className="mt-4 text-lg font-semibold dark:text-gray-300 animate-pulse">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
