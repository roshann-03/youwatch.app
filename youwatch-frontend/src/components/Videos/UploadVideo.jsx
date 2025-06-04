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

    // Create FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("isPublished", isPublished);

    try {
      await axiosFormData.post("/videos", formData);

      // Notify success
      notify("Video uploaded successfully!", "success");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
    } catch (error) {
      // Notify error
      notify("Failed to upload video");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 bg-gradient-to-r from-indigo-200 to-purple-300 lg:p-4 sm:px-8">
      {/* Upload Video Feature */}
      <div className="bg-white dark:bg-zinc-600  p-6 rounded-lg shadow-xl w-full sm:w-full lg:w-full flex flex-col sm:flex-row sm:space-y-0 justify-between items-center sm:space-x-6 z-10">
        {/* Left Section: Video Preview */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center dark:bg-zinc-600 bg-gray-100 p-4">
          {/* Video Preview */}
          {videoFile ? (
            <div className="w-full   overflow-hidden relative bg-black rounded-lg">
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="w-full h-full object-cover"
              ></video>
            </div>
          ) : (
            <div className="text-center dark:text-white text-gray-600">
              <p>Select a video file to preview.</p>
            </div>
          )}

          {thumbnail ? (
            <div className="mt-4 w-full h-48 overflow-hidden relative">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
              />
            </div>
          ) : (
            <div className="text-center dark:text-white text-gray-600">
              <p>Select a thumbnail file to preview.</p>
            </div>
          )}
        </div>

        {/* Right Section: Form Inputs */}
        <form onSubmit={handleUpload} className="w-full sm:w-1/2 space-y-3">
          <h2 className="text-3xl font-semibold dark:text-white text-gray-800 text-center mb-6">
            Upload Your Video
          </h2>

          {/* Video Title Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 text-gray-800 dark:text-white dark:bg-gray-800  bg-gray-50 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
              required
            />
          </div>

          {/* Video Description Input */}
          <div className="relative">
            <textarea
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 text-gray-800 dark:text-white dark:bg-gray-800  bg-gray-50 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
              required
            />
          </div>

          {/* Video File Input */}
          <div className="mb-6">
            <label
              htmlFor="videoFile"
              className="block dark:text-gray-50 text-gray-600 mb-2"
            >
              Upload Video
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="videoFile"
                className="cursor-pointer inline-block text-sm font-semibold px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Choose Video
              </label>

              <span className="text-sm text-gray-500 dark:text-white">
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

          {/* Thumbnail Input */}

          <div className="mb-6">
            <label
              htmlFor="thumbnail"
              className="block dark:text-gray-50 text-gray-600 mb-2"
            >
              Upload Thumbnail
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="thumbnail"
                className="cursor-pointer inline-block text-sm font-semibold px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Choose Thumbnail
              </label>

              <span className="text-sm text-gray-500 dark:text-white">
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
                    toast.error("File size exceeds limit: 100MB");
                    setThumbnail(null);
                    return;
                  }
                  setThumbnail(file);
                }
              }}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white p-3 rounded-lg transition-opacity duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Uploading...</h3>
            <div className="flex space-x-4">
              <div className="dot dot-1 bg-indigo-600 w-12 h-12 rounded-full animate-bounce"></div>
              <div className="dot dot-2 bg-indigo-600 w-12 h-12 rounded-full animate-bounce200"></div>
              <div className="dot dot-3 bg-indigo-600 w-12 h-12 rounded-full animate-bounce400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container for notifications */}
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
