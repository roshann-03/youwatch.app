import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const subscriptions = await Subscription.find({
    subscriber: req.user._id,
  }).populate("channel");
  const totalSubscribers = subscriptions.length;
  const totalVideos = await Video.countDocuments({ owner: req.user._id });
  const totalLikes = await Like.countDocuments({ likedBy: req.user._id });
  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        [totalLikes, totalSubscribers, totalVideos, totalViews],
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const videos = await Video.find({ owner: req.user._id });

  if (!videos) {
    return res.status(404).json(new ApiError(404, "No videos found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
