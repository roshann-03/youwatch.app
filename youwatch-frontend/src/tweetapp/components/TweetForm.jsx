import { useState } from "react";
import { createTweet } from "../api/tweetApi";
import { motion } from "framer-motion";
import { RichTextEditor, DEFAULT_CONTROLS } from "@mantine/rte";
// import "@mantine/rte/styles.css";

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const maxChars = 280;
  const RTEControls = DEFAULT_CONTROLS.map((controlsArr) => {
    return controlsArr.filter((control) => control !== "video");
  });
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedContent = content;
    let imgUrl = null;

    // Extract all <img> tags and their src
    const imgTags = [...content.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)];

    for (const [fullMatch, base64] of imgTags) {
      if (base64.startsWith("data:image")) {
        const blob = await (await fetch(base64)).blob();

        if (blob.size > 10 * 1024 * 1024) {
          alert("One of your images exceeds the 10MB limit (10MB max).");
          return;
        }

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "tweet_upload");
        setIsPosting(true);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        setIsPosting(false);

        const data = await res.json();
        if (!data.secure_url) {
          alert("Failed to upload image to Cloudinary.");
          return;
        }

        // Save the first image's URL (or make an array if needed)
        if (!imgUrl) {
          imgUrl = data.secure_url;
        }

        // Replace base64 with URL in content
        updatedContent = updatedContent.replace(base64, data.secure_url);
      }
    }

    // Remove all <img> tags from the content
    updatedContent = updatedContent.replace(/<img[^>]*>/g, "");

    const plainText = updatedContent.replace(/<[^>]+>/g, "").trim();
    if (!plainText) return;

    setIsPosting(true);
    try {
      const res = await createTweet({ content: updatedContent, imgUrl });
      onTweetCreated(res.data.data);
      setContent("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating tweet");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-gray-900 dark:bg-zinc-800 bg-white"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full ring-2 ring-sky-500 bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          <img
            src={`${currentUser?.avatar}`}
            className="rounded-full h-full w-full"
            alt="U"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="What's happening?"
            className="bg-zinc-200 rounded-lg text-sm break-words overflow-hidden"
            controls={RTEControls}
            // onImageUpload={handleImageUpload}
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {content.replace(/<[^>]+>/g, "").length}/{maxChars}
            </span>
            <button
              type="submit"
              disabled={
                isPosting || content.replace(/<[^>]+>/g, "").length > maxChars
              }
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                content.replace(/<[^>]+>/g, "").trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
