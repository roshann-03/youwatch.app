import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0a0f1c] dark:to-[#111827] transition-all">
      <div className="text-center space-y-8 font-sans dark:font-futuristic">
        {/* 404 Title */}
        <h1 className="text-7xl font-extrabold text-red-600 dark:text-cyan-400 tracking-wider dark:drop-shadow-[0_0_20px_rgba(0,255,255,0.7)] dark:animate-pulse">
          404
        </h1>

        {/* Message */}
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          Oops! Looks like you're lost.
        </p>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Try going back to the homepage or explore other content!
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="py-3 px-8 text-lg rounded-full text-white font-semibold bg-red-600 dark:bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg dark:shadow-[0_0_15px_#00fff7]"
        >
          🚀 Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
