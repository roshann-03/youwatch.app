import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    return res.status(400).json(new ApiError(400, "Content is required"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  if (!tweet) {
    return res.status(400).json(new ApiError(400, "Tweet cannot be created"));
  }
  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json(new ApiError(400, "User ID is required"));
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new ApiError(400, "Invalid User ID"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  const tweets = await Tweet.find({ owner: userId }).populate("owner");
  if (!tweets) {
    return res.status(404).json(new ApiError(404, "No tweets found"));
  }
  return res.status(200).json(new ApiResponse(200, tweets, "User tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet ID is required"));
  }
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return res.status(400).json(new ApiError(400, "Invalid Tweet ID"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId },
    { content: req.body.content },
    { new: true }
  );
  if (!updatedTweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet ID is required"));
  }
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return res.status(400).json(new ApiError(400, "Invalid Tweet ID"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }
  const deletedTweet = await Tweet.findOneAndDelete({ _id: tweetId });
  if (!deletedTweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
