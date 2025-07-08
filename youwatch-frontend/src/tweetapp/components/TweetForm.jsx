import { useState } from "react";
import { createTweet } from "../api/tweetApi";
import { motion } from "framer-motion";
import { RichTextEditor, DEFAULT_CONTROLS } from "@mantine/rte";

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const maxChars = 280;

  const RTEControls = DEFAULT_CONTROLS.map((arr) =>
    arr.filter((control) => control !== "video")
  );

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedContent = content;
    let imgUrl = null;

    const imgTags = [...content.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)];

    for (const [_, base64] of imgTags) {
      if (base64.startsWith("data:image")) {
        const blob = await (await fetch(base64)).blob();

        if (blob.size > 10 * 1024 * 1024) {
          alert("Image exceeds the 10MB limit.");
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
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.secure_url) {
          alert("Failed to upload image.");
          return;
        }

        if (!imgUrl) imgUrl = data.secure_url;
        updatedContent = updatedContent.replace(base64, data.secure_url);
      }
    }

    updatedContent = updatedContent.replace(/<img[^>]*>/g, "");
    const plainText = updatedContent.replace(/<[^>]+>/g, "").trim();
    if (!plainText) return;

    try {
      setIsPosting(true);
      const res = await createTweet({ content: updatedContent, imgUrl });
      onTweetCreated(res.data.data);
      setContent("");
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating tweet.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-zinc-200 dark:border-cyan-900 bg-white dark:bg-zinc-900 backdrop-blur-sm rounded-xl shadow-md"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full ring-2 ring-cyan-500 glow overflow-hidden">
          <img
            src={currentUser?.avatar}
            alt="U"
            className="rounded-full h-full w-full object-cover"
          />
        </div>

        {/* Editor */}
        <div className="flex-1 font-exo ">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="What's happening?"
            controls={RTEControls}
            className="text-sm bg-zinc-100 dark:bg-zinc-800 dark:border-cyan-700 dark:text-white rounded-lg h-[50vh]" 
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-cyan-400 font-exo">
              {content.replace(/<[^>]+>/g, "").length}/{maxChars}
            </span>

            <button
              type="submit"
              disabled={
                isPosting || content.replace(/<[^>]+>/g, "").length > maxChars
              }
              className={`px-4 py-2 text-sm font-futuristic rounded-full transition-all duration-200 ${
                content.replace(/<[^>]+>/g, "").trim()
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 "
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
