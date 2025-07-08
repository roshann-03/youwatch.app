import { useState } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  // Notify user via toast
  const notify = (message, type = "info") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // Handle video upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("isPublished", isPublished);

    try {
      await axiosFormData.post("/videos", formData);
      notify("Video uploaded successfully!", "success");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      setIsPublished(true);
    } catch (error) {
      notify("Failed to upload video");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen
      bg-gradient-to-r from-cyan-600 to-cyan-800
      dark:bg-gradient-to-r dark:from-[#010912] dark:via-[#05182a] dark:to-[#0f193b]
      p-4"
    >
      <div
        className="bg-white dark:bg-[#071423] dark:border dark:border-cyan-500
        p-6 rounded-xl dark:shadow-xl w-full max-w-5xl
        flex flex-col sm:flex-row sm:space-y-0 justify-between items-center sm:space-x-8 z-10"
      >
        {/* Left: Video Preview */}
        <div
          className="w-full sm:w-1/2 flex flex-col justify-center items-center
          dark:bg-[#071423] bg-gray-100 p-4 rounded-lg
          border-2 border-transparent dark:border-cyan-600
          dark:shadow-[0_0_15px_#00fff7]"
        >
          {videoFile ? (
            <div className="w-full overflow-hidden relative bg-black rounded-lg border-2 border-cyan-600 dark:shadow-[0_0_25px_#00fff7]">
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center dark:text-cyan-400 text-gray-600 font-mono">
              <p>Select a video file to preview.</p>
            </div>
          )}

          {thumbnail ? (
            <div className="mt-4 w-full h-48 overflow-hidden relative rounded-lg border-2 border-cyan-600 dark:shadow-[0_0_20px_#00fff7]">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center dark:text-cyan-400 text-gray-600 font-mono">
              <p>Select a thumbnail file to preview.</p>
            </div>
          )}
        </div>

        {/* Right: Form Inputs */}
        <form
          onSubmit={handleUpload}
          className="w-full sm:w-1/2 space-y-5"
          autoComplete="off"
        >
          <h2
            className="text-4xl font-extrabold text-center
            dark:text-cyan-400 text-cyan-900 font-mono
            tracking-wide dark:drop-shadow-[0_0_10px_rgba(0,255,247,0.7)]"
          >
            Upload Your Video
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4
                bg-gray-50 dark:bg-[#071423]
                text-gray-900 dark:text-cyan-300
                font-mono
                rounded-lg border-2 border-gray-300 dark:border-cyan-600
                focus:outline-none focus:ring-2 focus:ring-cyan-500
                dark:shadow-[0_0_15px_rgba(0,255,247,0)]
                focus:shadow-[0_0_15px_rgba(0,255,247,0.8)]
                transition duration-300"
              required
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <div className="relative">
            <textarea
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4
                bg-gray-50 dark:bg-[#071423]
                text-gray-900 dark:text-cyan-300
                font-mono
                rounded-lg border-2 border-gray-300 dark:border-cyan-600
                focus:outline-none focus:ring-2 focus:ring-cyan-500
                dark:shadow-[0_0_15px_rgba(0,255,247,0)]
                focus:shadow-[0_0_15px_rgba(0,255,247,0.8)]
                transition duration-300
                resize-none
                min-h-[100px]"
              required
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Video File */}
          <div>
            <label
              htmlFor="videoFile"
              className="block mb-2 font-semibold
                dark:text-cyan-300 text-gray-700 font-mono"
            >
              Upload Video
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="videoFile"
                className="cursor-pointer
                  px-5 py-2 rounded-full
                  bg-cyan-600 text-white font-mono font-semibold
                  hover:bg-cyan-700
                  transition
                  dark:shadow-[0_0_10px_rgba(0,255,247,0.8)]
                  hover:shadow-[0_0_20px_rgba(0,255,247,1)]
                "
              >
                Choose Video
              </label>
              <span className="text-sm text-gray-500 dark:text-cyan-300 font-mono">
                {videoFile ? videoFile.name : "No file chosen"}
              </span>
            </div>

            <input
              id="videoFile"
              type="file"
              accept="video/*"
              required
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const sizeInMB = file.size / (1024 * 1024);
                  if (sizeInMB > 100) {
                    toast.error("File size exceeds limit: 100MB");
                    setVideoFile(null);
                    return;
                  }
                  setVideoFile(file);
                }
              }}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block mb-2 font-semibold
                dark:text-cyan-300 text-gray-700 font-mono"
            >
              Upload Thumbnail
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="thumbnail"
                className="cursor-pointer
                  px-5 py-2 rounded-full
                  bg-cyan-600 text-white font-mono font-semibold
                  hover:bg-cyan-700
                  transition
                  dark:shadow-[0_0_10px_rgba(0,255,247,0.8)]
                  hover:shadow-[0_0_20px_rgba(0,255,247,1)]
                "
              >
                Choose Thumbnail
              </label>
              <span className="text-sm text-gray-500 dark:text-cyan-300 font-mono">
                {thumbnail ? thumbnail.name : "No file chosen"}
              </span>
            </div>

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              required
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const sizeInMB = file.size / (1024 * 1024);
                  if (sizeInMB > 20) {
                    toast.error("Thumbnail size exceeds limit: 20MB");
                    setThumbnail(null);
                    return;
                  }
                  setThumbnail(file);
                }
              }}
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="text-sm font-semibold text-gray-700 dark:text-cyan-100 mr-3">
              Publish
            </label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 accent-blue-600 dark:accent-cyan-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full
              bg-cyan-600
              text-white
              font-mono font-semibold
              p-4 rounded-lg
              transition
              duration-300
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-cyan-700 dark:shadow-[0_0_15px_rgba(0,255,247,0.9)]"
              }
            `}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center z-20">
          <div className="text-center">
            <h3
              className="text-5xl font-extrabold text-cyan-400 mb-6 font-mono
              dark:drop-shadow-[0_0_20px_rgba(0,255,247,0.8)]
              animate-pulse"
            >
              Uploading...
            </h3>
            <div className="flex space-x-6 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-full bg-cyan-500
                    animate-bounce
                    delay-[${i * 200}ms]
                    dark:shadow-[0_0_15px_rgba(0,255,247,0.9)]
                    `}
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UploadVideo;
