import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    // TODO: toggle subscription

    if (!channelId) {
      return res.status(400).json(new ApiError(400, "channelId required"));
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json(new ApiError(400, "Invalid channelId"));
    }
    if (!req.user || !req.user?._id) {
      return res.status(401).json(new ApiError(401, "User is Unauthorized"));
    }

    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json(new ApiError(404, "Channel not found"));
    }

    const toggleSubscribe = await Subscription.findOne({
      subscriber: req.user._id,
      channel: channelId,
    });
    if (!toggleSubscribe) {
      const subscribed = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId,
      });
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { subscribed: subscribed, isSubscribed: true },
            "Subscribed"
          )
        );
    } else {
      await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channelId,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { isSubscribed: false },
            "Unsubscribed successfully"
          )
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Sever Error while subscribing"));
  }
});

const isSubscribing = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) {
      return res.status(400).json(new ApiError(400, "channelId required"));
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json(new ApiError(400, "Invalid channelId"));
    }
    if (!req.user || !req.user?._id) {
      return res.status(401).json(new ApiError(401, "User is Unauthorized"));
    }

    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json(new ApiError(404, "Channel not found"));
    }

    const toggleSubscribe = await Subscription.findOne({
      subscriber: req.user._id,
      channel: channelId,
    });
    if (!toggleSubscribe) {
      return res
        .status(200)
        .json(new ApiResponse(200, { isSubscribed: false }, "Not Subscribed"));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, { isSubscribed: true }, "Subscribed"));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Sever Error while subscribing"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) {
      return res.status(400).json(new ApiError(400, "channelId required"));
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json(new ApiError(400, "Invalid channelId"));
    }
    if (!req.user || !req.user?._id) {
      return res.status(401).json(new ApiError(401, "User is Unauthorized"));
    }

    const channelExists = await Subscription.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json(new ApiError(404, "Channel not found"));
    }

    const subscribers = await Subscription.find({
      subscriber: req.user._id,
      channel: channelId,
    }).populate("subscriber");

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Sever Error while fetching subscribers")
      );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  try {
    // TODO: toggle subscription
    if (!channelId) {
      return res.status(400).json(new ApiError(400, "channelId required"));
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json(new ApiError(400, "Invalid channelId"));
    }
    if (!req.user || !req.user?._id) {
      return res.status(401).json(new ApiError(401, "User is Unauthorized"));
    }
    const subscribers = await Subscription.find({
      subscriber: req.user._id,
      channel: channelId,
    }).populate("channel");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribers,
          "Channel subscribed to fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Sever Error while fetching subscribers")
      );
  }
});

const getSubscribingChannels = asyncHandler(async (req, res) => {
  try {
    // TODO: toggle subscription
    if (!req.user || !req.user?._id) {
      return res.status(401).json(new ApiError(401, "User is Unauthorized"));
    }
    const subscribers = await Subscription.find({
      subscriber: req.user._id,
    }).populate("channel", "-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribers,
          "Channel subscribed to fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Sever Error while fetching subscribers")
      );
  }
});

export {
  toggleSubscription,
  isSubscribing,
  getUserChannelSubscribers,
  getSubscribedChannels,
  getSubscribingChannels,
};
