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
  const notify = (message) => toast(message);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      notify("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      console.log("Upload response:", response.data);
    } catch (error) {
      notify("Failed to upload video");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-5  bg-gray-900">
      <form
        onSubmit={handleUpload}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="mb-6 text-2xl text-white font-semibold text-center">
          Upload Video
        </h2>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-600 bg-gray-700 text-white p-3 mb-4 w-full rounded focus:outline-none focus:border-blue-500"
          required
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 bg-gray-700 text-white p-3 mb-4 w-full rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* Video File Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Video File</label>
          <input
            type="file"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200"
            accept="video/*"
            required
          />
        </div>

        {/* Thumbnail Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Thumbnail</label>
          <input
            type="file"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              // Optional: Show a preview of the thumbnail
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200"
            accept="image/*"
            required
          />
          {/* Optional: Thumbnail preview */}
          {thumbnail && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="w-full h-auto rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg transition-opacity duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UploadVideo;
