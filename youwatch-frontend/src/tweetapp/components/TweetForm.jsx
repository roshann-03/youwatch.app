import { useState } from "react";
import { createTweet } from "../api/tweetApi";
import { motion } from "framer-motion";
// import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Tweet.module.css";
// Dynamically import Quill to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const maxChars = 280;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const textOnly = content.replace(/<[^>]+>/g, "").trim(); // Strip HTML for char count
    if (!textOnly) return;

    setIsPosting(true);
    try {
      const res = await createTweet({ content });
      onTweetCreated(res.data.data);
      setContent("");
      window.location.href = window.location.href;
    } catch (err) {
      alert(err.response?.data?.message || "Error creating tweet");
    } finally {
      setIsPosting(false);
    }
  };

  const modules = {
    toolbar: [["bold", "italic", "code"], [{ list: "bullet" }]],
  };

  const formats = ["bold", "italic", "code", "list", "bullet"];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-gray-900 dark:bg-zinc-800   bg-white"
    >
      <div className="flex items-start space-x-3 ">
        <div className="w-10 h-10 rounded-full ring-2 ring-sky-500  bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          <img
            src={`${currentUser?.avatar}`}
            className="rounded-full h-full w-full"
            alt="U"
          />
        </div>

        <div className="flex-1  ">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="What's happening?"
            className=" bg-zinc-300  rounded-lg text-sm "
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 ">
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
