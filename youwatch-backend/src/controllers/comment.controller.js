import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import notifyUser from "../utils/notifyUser.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get comments for a video
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video ID is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid Video ID"));
  }

  const pageAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        content: "$content",
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
          avatar: "$owner.avatar",
        },
        createdAt: 1,
      },
    },
  ]);

  const pageOptions = {
    page: Number(page),
    limit: Number(limit),
  };

  try {
    const result = await Comment.aggregatePaginate(pageAggregate, pageOptions);

    if (!result) {
      return res.status(404).json(new ApiError(404, "Comments not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Comments fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot fetch comments"));
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  function shortContent(str) {
    let newStr = str.slice(0, 15);
    newStr += "...";
    return newStr;
  }
  try {
    const { videoId } = req.params;
    const { userId, content } = req.body;
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!content) {
      return res.status(400).json(new ApiError(400, "Content is required"));
    }
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiError(401, "User is not authenticated"));
    }
    const comment = await Comment.create({
      video: videoId,
      content: content,
      owner: req.user._id,
    });
    if (!comment) {
      return res.status(500).json(new ApiError(500, "Cannot add comment"));
    }
    if (userId.toString() !== req.user?._id.toString()) {
      await notifyUser(
        userId,
        "comment",
        `${req.user?.username} comment on your video! ${shortContent(content)}`,
        `${videoId}`
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot add comment"));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  try {
    const { videoId, commentId } = req.params;
    const { content } = req.body;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Valid Comment ID is required"));
    }
    if (!content) {
      return res.status(400).json(new ApiError(400, "Content is required"));
    }
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, video: videoId },
      { content: content },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json(new ApiError(404, "Comment not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot update comment"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  try {
    const { videoId, commentId } = req.params;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Valid Comment ID is required"));
    }

    const deleteComment = await Comment.findOneAndDelete({
      _id: commentId,
      video: videoId,
    });
    if (!deleteComment) {
      return res.status(404).json(new ApiError(404, "Comment not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment deleted successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot delete comment"));
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
