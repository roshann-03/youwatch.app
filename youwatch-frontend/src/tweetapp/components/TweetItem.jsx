import { deleteTweet, updateTweet } from "../api/tweetApi";
import { useState } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import styles from "./Tweet.module.css";
import { Edit, Trash2 } from "lucide-react";
import { Avatar, Button, Group } from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";

export default function TweetItem({ tweet, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
    window.location.reload(); // optional: refresh UI instantly
  };

  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=" p-4 sm:p-6 border-b border-gray-200 dark:border-cyan-700 rounded-xl hover:bg-gray-200 dark:bg-zinc-800  dark:hover:bg-zinc-900 bg-gray-50  transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          {/* User Info & Buttons */}
          <div className="flex sm:flex-row sm:items-center gap-4 flex-wrap">
            {/* Avatar */}
            <Avatar
              src={tweet?.owner?.avatar}
              alt="Avatar"
              radius="xl"
              size="md"
            />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <a
                href={`/channel/${tweet.owner?.username}`}
                className="font-exo text-sm sm:text-base font-semibold text-gray-800 dark:text-cyan-300 hover:underline"
              >
                @{tweet.owner?.username || "user"}
              </a>
              <span className="ml-0 sm:ml-2 text-xs text-gray-500 dark:text-gray-400 font-exo">
                {formattedDate}
              </span>
            </div>

            {/* Edit/Delete Controls */}
            {currentUser?._id === tweet?.owner?._id && (
              <Group spacing="xs" className="mt-2 sm:mt-0">
                <Button
                  size="xs"
                  variant="subtle"
                  color="blue"
                  onClick={() => setIsEditing(!isEditing)}
                  leftIcon={<Edit size={16} />}
                  className="hover:bg-blue-100 dark:hover:bg-cyan-900 transition-all"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={handleDelete}
                  leftIcon={<Trash2 size={16} />}
                  className="hover:bg-red-100 dark:hover:bg-red-900 transition-all"
                >
                  Delete
                </Button>
              </Group>
            )}
          </div>

          {/* Tweet Content */}
          {isEditing ? (
            <div className="mt-4">
              <RichTextEditor value={newContent} onChange={setNewContent} />
              <Group mt="sm">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  color="green"
                  className="font-exo"
                >
                  Save
                </Button>
              </Group>
            </div>
          ) : (
            <div
              className={`mt-3 prose prose-sm sm:prose max-w-none break-words font-exo dark:prose-invert ${styles.customProse}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tweet.content),
              }}
            />
          )}

          {/* Optional Tweet Image */}
          {tweet?.images?.[0] && (
            <img
              src={tweet.images[0]}
              alt="Tweet"
              className="mt-4 w-full max-h-72 object-cover rounded-lg border border-gray-200 dark:border-cyan-800 shadow-sm"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
