import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { axiosJSON } from "../api/axiosInstances";

const CommentSection = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [hasNextPage, setHasNextPage] = useState(null);

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
    const newComment = { content: comment };

    try {
      const response = await axiosJSON.post(`/comments/${id}`, newComment);
      setComments((prevComments) => [
        ...prevComments,
        { ...response.data.data, isLiked: false },
      ]); // Initialize isLiked
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  useEffect(() => {
    loadInitialComments();
  }, []);

  const loadMoreComments = async () => {
    if (!comments.length) return;
    if (!hasNextPage) {
      setPage(1);
      loadInitialComments();
      return;
    }
    const moreComments = await fetchComments(page);
    setComments((prevComments) => [...prevComments, ...moreComments]);
    setPage((prev) => prev + 1);
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

  const handleEditComment = async (e, videoId, commentId) => {
    e.preventDefault();
    const updatedComment = { content: editingCommentContent };

    try {
      const response = await axiosJSON.patch(
        `/comments/c/${videoId}/${commentId}`,
        updatedComment
      );
      setComments((prevComments) =>
        prevComments.map((c) => (c._id === commentId ? response.data.data : c))
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (videoId, commentId) => {
    try {
      await axiosJSON.delete(`/comments/c/${videoId}/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId)
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const toggleLikeComment = async (commentId) => {
    try {
      const response = await axiosJSON.post(
        `/likes/toggle/c/${commentId}`,
        {},
        { withCredentials: true }
      );

      const isLiked = response.data.data.isLiked; // Assuming this is the response structure
      // Update the comments state to reflect the new like status
      setComments((prevComments) =>
        prevComments.map(
          (c) => (c._id === commentId ? { ...c, isLiked } : c) // Add isLiked without losing other data
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };
  useEffect(() => {
    const isLikedOnComment = () => {};
  });
  const [showOptions, setShowOptions] = useState(null); // Track which comment's options to show

  const toggleOptions = (commentId) => {
    setShowOptions((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <div className="mt-4 items-center  justify-center px-5">
      <div className="rounded px-5">
        <p className="text-xl dark:text-gray-50 font-medium mb-5 ">
          {formatCommentsCount(comments.length)}
        </p>
        <div className="flex items-center w-full">
          <div className="user-img  w-14 rounded-full object-cover object-center">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full rounded-full mr-2"
            />
          </div>
          <form
            onSubmit={handleCommentSubmit}
            className="flex ml-2 mb-4 w-full"
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border-b-[1px] outline-none border-zinc-400 p-2 flex-grow bg-transparent"
              placeholder="Add a comment..."
              required
            />
          </form>
        </div>

        <ul className="mt-2 flex flex-col gap-5">
          {comments.length === 0 && <li>No comments yet</li>}
          {comments.map((c) => (
            <li key={c._id} className="flex items-start p-5">
              <img
                src={c.owner.avatar}
                alt={c.owner.username}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div className="flex flex-col relative">
                <div className="flex gap-2 items-center mb-1">
                  <p className="font-semibold">@{c.owner.username}</p>
                  <p className="text-sm dark:text-gray-300 tracking-tight">
                    {timeAgo(c.createdAt)}
                  </p>
                  {user._id === c.owner._id && (
                    <button
                      onClick={() => toggleOptions(c._id)}
                      className="dark:text-gray-300 text-xl font-bold ml-3 hover:text-gray-400 focus:outline-none"
                    >
                      ⋮
                    </button>
                  )}
                  {showOptions === c._id && (
                    <div className="absolute right-3 top-5 bg-gray-800 rounded shadow-lg p-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(c._id);
                          setEditingCommentContent(c.content);
                          setShowOptions(null); // Close options after clicking
                        }}
                        className="block w-full text-yellow-600 hover:text-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteComment(id, c._id);
                          setShowOptions(null); // Close options after clicking
                        }}
                        className="block w-full text-red-600 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingCommentId === c._id ? (
                  <form
                    onSubmit={(e) => {
                      handleEditComment(e, id, c._id);
                    }}
                  >
                    <input
                      type="text"
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      className="border-b-[1px] outline-none border-zinc-400 p-2 bg-transparent"
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="text-blue-500">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentContent("");
                        }}
                        className="text-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="dark:text-gray-200 max-w-md break-words">
                      {c.content}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => toggleLikeComment(c._id)}>
                        {c.isLiked ? <BiSolidLike /> : <BiLike />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
          <li>
            <button
              onClick={loadMoreComments}
              className="text-blue-500 mt-2"
              disabled={comments.length === 0}
            >
              {!hasNextPage && comments.length >= 10
                ? "Show less"
                : comments.length >= 10
                ? "Load more comments"
                : ""}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommentSection;
