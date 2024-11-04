import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: toggle like on video
    if (!videoId) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, "Invalid Video ID"));
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiError(401, "User is not authenticated"));
    }
    const toggleLike = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
    });

    if (!toggleLike) {
      const liked = await Like.create({
        video: videoId,
        likedBy: req.user._id,
      });
      return res.status(200).json(new ApiResponse(200, liked, "Video liked"));
    } else {
      await Like.findOneAndDelete({
        video: videoId,
        likedBy: req.user._id,
      });
      return res.status(200).json(new ApiResponse(200, null, "Like removed"));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot like the video"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  try {
    //TODO: toggle like on video
    if (!commentId) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json(new ApiError(400, "Invalid Video ID"));
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiError(401, "User is not authenticated"));
    }
    const toggleLike = await Like.findOne({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (!toggleLike) {
      const liked = await Like.create({
        comment: commentId,
        likedBy: req.user._id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { liked, isLiked: true }, "Comment liked"));
    } else {
      await Like.findOneAndDelete({
        comment: commentId,
        likedBy: req.user._id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: false }, "Like removed"));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot like the comment"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  try {
    //TODO: toggle like on video
    if (!tweetId) {
      return res.status(400).json(new ApiError(400, "Video ID is required"));
    }
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      return res.status(400).json(new ApiError(400, "Invalid Video ID"));
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiError(401, "User is not authenticated"));
    }
    const toggleLike = await Like.findOne({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    if (!toggleLike) {
      const liked = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
      });
      return res.status(200).json(new ApiResponse(200, liked, "Tweet liked"));
    } else {
      await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: req.user._id,
      });
      return res.status(200).json(new ApiResponse(200, null, "Like removed"));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot like the tweet"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User is unauthorized "));
    }
    const likedVideos = await Like.find({
      likedBy: req.user._id,
    }).populate("video");

    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Cannot fetch liked videos"));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
