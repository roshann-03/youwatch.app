import { deleteTweet, updateTweet } from "../api/tweetApi";
import { useState } from "react";

export default function TweetItem({ tweet, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);

  const handleDelete = async () => {
    await deleteTweet(tweet._id);
    onDelete(tweet._id);
  };

  const handleUpdate = async () => {
    const res = await updateTweet(tweet._id, { content: newContent });
    onUpdate(res.data.data);
    setIsEditing(false);
  };

  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            @{tweet.owner?.username || "user"} · {formattedDate}
          </p>
        </div>
        <div className="space-x-2 text-sm">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-500">
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
          <button
            onClick={handleUpdate}
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </>
      ) : (
        <p className="mt-2">{tweet.content}</p>
      )}
    </div>
  );
}
