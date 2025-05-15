import { deleteTweet, updateTweet } from "../api/tweetApi";
import { useState } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import styles from "./Tweet.module.css";
import ReactQuill from "react-quill";
export default function TweetItem({ tweet, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const modules = {
    toolbar: [["bold", "italic", "code"], [{ list: "bullet" }]],
  };

  const formats = ["bold", "italic", "code", "list", "bullet"];

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this tweet?")) {
      await deleteTweet(tweet._id);
      onDelete(tweet._id);
    }
  };

  const handleUpdate = async () => {
    const res = await updateTweet(tweet._id, { content: newContent });
    onUpdate(res.data.data);
    setIsEditing(false);
    window.location.href = window.location.href;
  };

  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=" p-10 border-b  border-gray-500 dark:text-white dark:hover:bg-zinc-700  hover:bg-zinc-200 transition duration-300"
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full dark:bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          <img
            src={`${tweet.owner?.avatar}`}
            className="rounded-full h-full w-full"
            alt="U"
          />
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <a
                href={`/channel/${tweet.owner?.username}`}
                className="font-semibold dark:text-gray-200  text-gray-800 hover:underline"
              >
                @{tweet.owner?.username || "user"}
              </a>
              <span className="ml-2 text-sm  dark:text-gray-200  text-gray-500">
                {formattedDate}
              </span>
            </div>

            {/* Edit/Delete Controls */}
            {currentUser?._id === tweet.owner._id && (
              <div className="space-x-2 text-sm">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500  hover:underline"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-2">
              <ReactQuill
                value={newContent}
                onChange={(value) => setNewContent(value)}
                modules={modules}
                formats={formats}
                className="bg-zinc-100 rounded-lg text-sm text-black"
              />

              <button
                onClick={handleUpdate}
                className="mt-2 bg-green-500  text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              className={`mt-2 prose prose-lg max-w-none ${styles.customProse}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tweet.content),
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
