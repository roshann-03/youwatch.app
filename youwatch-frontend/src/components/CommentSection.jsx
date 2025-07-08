import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { axiosJSON } from "../api/axiosInstances";

const CommentSection = ({ owner }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [hasNextPage, setHasNextPage] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

  useEffect(() => {
    loadInitialComments();
  }, []);

  const loadMoreComments = async () => {
    if (!comments.length) return;

    if (!hasNextPage) {
      setPage(1);
      loadInitialComments(); // Reset to first page
      return;
    }

    const moreComments = await fetchComments(page);
    setComments((prev) => [...prev, ...moreComments]);
    setPage((prev) => prev + 1);
  };

  const fetchComments = async (currentPage) => {
    try {
      const response = await axiosJSON.get(
        `/comments/${id}?page=${currentPage}`
      );

      const newComments = response.data.data.docs.sort(
        () => Math.random() - 0.5
      );
      setHasNextPage(response.data.data.hasNextPage);
      return newComments;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      return [];
    }
  };

  const loadInitialComments = async () => {
    const initialComments = await fetchComments(1);
    setComments(initialComments);
    setPage(2);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosJSON.post(`/comments/${id}`, {
        userId: owner._id,
        content: comment,
      });
      setComments((prev) => [
        ...prev,
        { ...response.data.data, isLiked: false },
      ]);
      setComment("");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleEditComment = async (e, videoId, commentId) => {
    e.preventDefault();
    try {
      const response = await axiosJSON.patch(
        `/comments/c/${videoId}/${commentId}`,
        {
          content: editingCommentContent,
        }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data.data : c))
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDeleteComment = async (videoId, commentId) => {
    try {
      await axiosJSON.delete(`/comments/c/${videoId}/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const toggleLikeComment = async (commentId) => {
    try {
      const response = await axiosJSON.post(`/likes/toggle/c/${commentId}`, {});
      const isLiked = response.data.data.isLiked;
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, isLiked } : c))
      );
    } catch (error) {
      console.error("Like toggle error:", error);
    }
  };

  const toggleOptions = (commentId) => {
    setShowOptions((prev) => (prev === commentId ? null : commentId));
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
  };

  const formatCommentsCount = (count) => {
    if (count === 1) return "1 Comment";
    if (count < 1000) return `${count} Comments`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k Comments`;
    return `${(count / 1000000).toFixed(1)}m Comments`;
  };

  return (
    <div className="mt-4 items-center justify-center px-5">
      <div className="rounded px-5">
        <p className="text-xl dark:text-cyan-400 font-semibold mb-5 text-gray-800">
          {formatCommentsCount(comments.length)}
        </p>

        {/* Comment Input */}
        <div className="flex items-center w-full mb-6">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full mr-4"
          />
          <form onSubmit={handleCommentSubmit} className="flex-grow">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border-b-2 p-2 bg-transparent dark:border-cyan-500 border-gray-400 text-gray-900 dark:text-white focus:outline-none"
              required
            />
          </form>
        </div>

        {/* Comment List */}
        <ul className="space-y-6">
          {comments.map((c) => (
            <li
              key={c._id}
              className="relative p-5 rounded-xl bg-white text-gray-800 dark:bg-[#0b1120] dark:text-gray-100 dark:border dark:border-cyan-700 shadow-md dark:shadow-[0_0_12px_#00ffee22] transition-all"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={c.owner.avatar}
                  alt={c.owner.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <p className="font-semibold text-sm">
                        @{c.owner.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>
                    {user._id === c.owner._id && (
                      <button
                        onClick={() => toggleOptions(c._id)}
                        className="text-xl text-cyan-400 hover:text-cyan-300"
                      >
                        ⋮
                      </button>
                    )}
                  </div>

                  {editingCommentId === c._id ? (
                    <form
                      onSubmit={(e) => handleEditComment(e, id, c._id)}
                      className="mt-2"
                    >
                      <input
                        type="text"
                        value={editingCommentContent}
                        onChange={(e) =>
                          setEditingCommentContent(e.target.value)
                        }
                        className="w-full border-b border-cyan-500 bg-transparent text-white focus:outline-none p-1"
                        required
                      />
                      <div className="flex gap-3 mt-2 text-sm">
                        <button type="submit" className="text-cyan-400">
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingCommentContent("");
                          }}
                          className="text-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-2 text-sm break-words">{c.content}</p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => toggleLikeComment(c._id)}
                      className="text-xl text-cyan-300 hover:scale-110 transition-transform"
                    >
                      {c.isLiked ? <BiSolidLike /> : <BiLike />}
                    </button>
                  </div>
                </div>
              </div>

              {showOptions === c._id && (
                <div className="absolute top-5 right-5 bg-[#1f2937] border border-cyan-600 text-sm rounded-md shadow-md p-2 space-y-1">
                  <button
                    onClick={() => {
                      setEditingCommentId(c._id);
                      setEditingCommentContent(c.content);
                      setShowOptions(null);
                    }}
                    className="block text-yellow-400 hover:text-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteComment(id, c._id);
                      setShowOptions(null);
                    }}
                    className="block text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}

          {/* Load More Button */}
          {comments.length > 0 && (
            <li>
              <button
                onClick={loadMoreComments}
                className="mt-4 text-cyan-600 hover:underline"
              >
                {hasNextPage ? "Load more comments" : "Show less"}
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommentSection;
