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
    window.location.reload(); // optional, but to reflect instantly
  };

  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 border-b border-gray-300 dark:border-gray-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <Avatar src={tweet?.owner?.avatar} alt="Avatar" radius="xl" size="md" />

        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <a
                href={`/channel/${tweet.owner?.username}`}
                className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200 hover:underline"
              >
                @{tweet.owner?.username || "user"}
              </a>
              <span className="ml-0 sm:ml-2 text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>
            </div>

            {/* Edit/Delete Buttons */}
            {currentUser?._id === tweet?.owner?._id && (
              <Group spacing="xs" className="mt-2 sm:mt-0">
                <Button
                  size="xs"
                  color="blue"
                  variant="subtle"
                  onClick={() => setIsEditing(!isEditing)}
                  leftIcon={<Edit size={16} />}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  size="xs"
                  color="red"
                  variant="subtle"
                  onClick={handleDelete}
                  leftIcon={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </Group>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-3">
              <RichTextEditor value={newContent} onChange={setNewContent} />
              <Group mt="sm">
                <Button size="sm" onClick={handleUpdate} color="green">
                  Save
                </Button>
              </Group>
            </div>
          ) : (
            <div
              className={`mt-3 prose prose-sm sm:prose max-w-none break-words ${styles.customProse}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tweet.content),
              }}
            />
          )}

          {/* Image */}
          {tweet?.images?.[0] && (
            <img
              src={tweet.images[0]}
              alt="Tweet"
              className="mt-4 w-full max-h-72 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
