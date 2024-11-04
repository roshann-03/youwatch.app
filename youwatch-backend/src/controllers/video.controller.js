import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Validate pagination options
  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  // Prepare regex query if query exists
  let matchStage = {};
  if (query && typeof query === "string" && query.trim()) {
    matchStage = {
      $or: [
        { title: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
      ],
    };
  }

  const aggregateVideos = Video.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        duration: 1,
        createdAt: 1,
        updatedAt: 1,
        isPublished: 1,
        owner: {
          _id: "$owner._id",
          name: "$owner.username",
          avatar: "$owner.avatar",
        },
      },
    },
    // Sort stage
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1, // Ascending or Descending
      },
    },
  ]);

  // Paginate the results
  const videos = await Video.aggregatePaginate(aggregateVideos, options);

  if (!videos || videos.length === 0) {
    return res.status(404).json(new ApiError(404, "No videos found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title) {
    throw new ApiError(400, "Title and description are required");
  }
  if (!req?.user && !req?.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath && !thumbnailLocalPath) {
    throw new ApiError(400, "videoLocalPath Error: Video file is required");
  }
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedVideoThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideo && !uploadedVideoThumbnail) {
    throw new ApiError(400, "Video file and thumbnail is required");
  }
  const video = await Video.create({
    videoFile: uploadedVideo?.secure_url,
    thumbnail: uploadedVideoThumbnail?.secure_url,
    title,
    description: description || "",
    duration: uploadedVideo?.duration,
    isPublished: true,
    owner: req.user._id,
  });
  if (!video) {
    return res.status(400).json(new ApiError(400, "Video cannot be created"));
  }
  return res.status(201).json(new ApiResponse(201, video, "Video created"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // Validate video ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"));
  }
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
      $lookup: {
        from: "subscriptions", // subscriptions collection
        localField: "owner._id", // Match with the owner's ID
        foreignField: "channel", // Match with the channel field in subscriptions
        as: "subscribers", // Store results in this field
      },
    },
    {
      $lookup: {
        from: "likes", // likes collection
        localField: "_id", // Match with the video ID
        foreignField: "video", // Match with the video field in likes
        as: "likes", // Store results in this field
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        likes: {
          $size: "$likes",
        },
        duration: 1,
        createdAt: 1,
        updatedAt: 1,
        isPublished: 1,
        owner: {
          _id: "$owner._id",
          name: "$owner.username",
          avatar: "$owner.avatar",
        },
        subscriberCount: { $size: "$subscribers" }, // Count of subscribers
      },
    },
    {
      $limit: 1,
    },
  ]);

  if (!video || video.length === 0) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  return res.status(200).json(new ApiResponse(200, video[0], "Video fetched"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }
  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(
      400,
      "thumbnailLocalPath Error: Thumbnail file is required"
    );
  }
  const updateVideoThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!updateVideoThumbnail) {
    throw new ApiError(400, "Video file and thumbnail is required");
  }
  const video = await Video.findOneAndUpdate(
    { _id: videoId },
    {
      $set: {
        thumbnail: updateVideoThumbnail?.secure_url,
        title: req.body?.title,
        description: req.body?.description,
        isPublished: req.body?.isPublished,
      },
    },
    { new: true }
  );
  if (!video) {
    return res.status(400).json(new ApiError(400, "Video cannot be updated"));
  }
  return res.status(200).json(new ApiResponse(200, video, "Video updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"));
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "User is not authenticated"));
  }
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }
  const video = await Video.findOneAndDelete({ _id: videoId });
  if (!video) {
    return res.status(400).json(new ApiError(400, "Video cannot be deleted"));
  }
  return res.status(200).json(new ApiResponse(200, null, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: toggle publish status
    if (!isValidObjectId(videoId)) {
      return res.status(400).json(new ApiError(400, "Invalid video ID"));
    }
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiError(401, "User is not authenticated"));
    }
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
      return res.status(404).json(new ApiError(404, "Video not found"));
    }
    const video = await Video.findOneAndUpdate(
      { _id: videoId },
      [
        {
          $set: {
            isPublished: {
              $cond: [{ $eq: ["$isPublished", true] }, false, true],
            },
          },
        },
      ],
      { new: true }
    );
    if (!video) {
      return res.status(400).json(new ApiError(400, "Video cannot be updated"));
    }
    return res.status(200).json(new ApiResponse(200, video, "Video updated"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal server error while video toggle publish")
      );
  }
});

const getAllVideosById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json(new ApiError(400, "Invalid user ID"));
  }

  const video = await Video.find({ owner: userId }).populate(
    "owner",
    "-password -refreshToken"
  );

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }
  return res.status(200).json(new ApiResponse(200, video, "Video fetched"));
});

const getLikesByVideoId = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    // Validate video ID
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, "Invalid video ID"));
    }
    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "likes", // likes collection
          localField: "_id", // Match with the video ID
          foreignField: "video", // Match with the video field in likes
          as: "likes", // Store results in this field
        },
      },
      {
        $project: {
          _id: 1,
          likes: {
            $size: "$likes",
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!video || video.length === 0) {
      return res.status(404).json(new ApiError(404, "Video not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video[0], "Video fetched"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosById,
  getLikesByVideoId,
};
