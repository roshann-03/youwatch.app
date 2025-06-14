import { useState } from "react";
import { axiosFormData } from "../../api/axiosInstances";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const VideoUpdateForm = () => {
  const location = useLocation();
  const { video } = location.state || {};
  const navigate = useNavigate();
  const notify = (message) => toast(message);
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [isPublished, setIsPublished] = useState(video?.isPublished || false);
  const [thumbnail, setThumbnail] = useState(video?.thumbnail || null);
  const [loading, setLoading] = useState(false);
  // console.log(video.thumbnail);
  const handleFileChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (!thumbnail) {
      formData.append("existingThumnailURL", video?.thumbnail);
    } else {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublished", isPublished);

    try {
      setLoading(true);
      await axiosFormData.patch(`/videos/${video?._id}`, formData);
      setLoading(false);
      notify("Video updated successfully");
      event.target.reset();
      navigate("/my-videos", { replace: true });
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <div className="flex justify-center py-10 items-center min-h-screen h-full w-full bg-black">
      <div className="min-h-screen h-fit w-fit">
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="mr-2 text-sm font-semibold">Publish:</label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Thumbnail:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                   file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <button
            type="submit"
            className={`w-full  ${
              loading ? "opacity-50" : ""
            } bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200`}
          >
            {loading ? "Updating..." : "Update Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpdateForm;
