import { useState } from "react";
import { createTweet } from "../api/tweetApi";

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      const res = await createTweet({ content });
      onTweetCreated(res.data.data);
      setContent("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating tweet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-300">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border rounded resize-none"
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Post
      </button>
    </form>
  );
}
