import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:8000/api/v1/videos"; // Update this to your API endpoint

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

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // Notify success
      notify("Video uploaded successfully!", "success");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      console.log("Upload response:", response.data);
    } catch (error) {
      // Notify error
      notify("Failed to upload video");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-8">
      <form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
          Upload Video
        </h2>

        {/* Video Title Input */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 bg-gray-50 text-gray-800 p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          required
        />

        {/* Video Description Input */}
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 bg-gray-50 text-gray-800 p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          required
        />

        {/* Video File Input */}
        <div className="mb-6">
          <label htmlFor="videoFile" className="block text-gray-600 mb-2">
            Video File
          </label>
          <input
            id="videoFile"
            type="file"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200"
            accept="video/*"
            required
          />
        </div>

        {/* Thumbnail Input */}
        <div className="mb-6">
          <label htmlFor="thumbnail" className="block text-gray-600 mb-2">
            Thumbnail (Optional)
          </label>
          <input
            id="thumbnail"
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200"
            accept="image/*"
          />
          {/* Thumbnail preview */}
          {thumbnail && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white p-3 rounded-lg transition-opacity duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

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
