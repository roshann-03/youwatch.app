import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-8">
        {/* 404 Title */}
        <h1 className="text-6xl font-bold text-red-500">404</h1>

        {/* Message */}
        <p className="text-2xl font-semibold mb-4">
          Oops! Looks like you're lost.
        </p>

        {/* Description */}
        <p className="text-lg mb-6">
          The page you're looking for doesn't exist or has been moved. Try going
          back to the homepage or explore other content!
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded-full text-xl transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
