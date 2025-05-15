import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import generateAccessAndRefereshTokens from "../utils/generateAccessRefreshToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// Generate access and refresh tokens

//Register route using post request
const registerUser = asyncHandler(async (req, res) => {
  //get user information
  const { fullName, email, username, password } = req.body;
  //Small checking if the information is blank
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    // If the information is blank return error
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  //Check If the user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  //If the user already exists return error
  if (existedUser && !existedUser?.isGoogleUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with email or username already exists"));
  }
  if (existedUser?.isGoogleUser) {
    return res
      .status(400)
      .json(new ApiError(400, "Please log in using Google for this account."));
  }

  //Upload avatar and cover image
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //If the file is not given by user
  if (!avatarLocalPath) {
    return res
      .status(400)
      .json(
        new ApiError(400, "avatarLocalPath Error: Avatar file is required")
      );
  }
  //Upload avatar and cover image on cloudinary cloud storage
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    return res.status(400).json(new ApiError(400, "Avatar file is required"));
  }

  const user = {
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  };

  //Create a new user
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User went for otp verification"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  // Ensure at least one identifier is provided
  if (!emailOrUsername) {
    return res
      .status(400)
      .json(new ApiError(400, "Username or email is required"));
  }

  // Normalize email for case-insensitivity
  const normalizedEmailOrUsername = emailOrUsername
    ? emailOrUsername.toLowerCase()
    : null;

  // Find user by email or username
  const user = await User.findOne({
    $or: [
      { email: normalizedEmailOrUsername },
      { username: normalizedEmailOrUsername },
    ],
  });

  if (user?.isGoogleUser) {
    throw new ApiError(404, "Please log in using Google for this account.");
  } else if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // Select user data excluding password and refreshToken
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true only for production, // Set to false if not using HTTPS during development
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for production, "Lax" for development
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true only for production,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for production, "Lax" for development
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true only for production,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for production, "Lax" for development
      maxAge: 86400000,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (user?.isGoogleUser) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "You have used google account to signup can't change the password"
        )
      );
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName } = req.body;
  if (!username || !fullName) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        fullName,
      },
    },
    { new: true }
  ).select("-password");
  req.user = user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save to user model
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes

  await user.save({ validateBeforeSave: false });

  // Prepare reset link
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `Hello ${user.username || "user"},\n\nYou requested a password reset.\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 30 minutes.\n\nIf you didn't request this, please ignore this email.`;

  try {
    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset link sent to your email"));
  } catch (error) {
    // Cleanup token fields if sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Failed to send reset email. Try again later.");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from JWT payload (assuming it's added to the request by the middleware)

    // Find user by ID and delete it
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true only for production,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for production, "Lax" for development
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options);
    req.user = null;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Send success response
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Account deleted successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, null, error.message));
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  forgotPassword,
  resetPassword,
  deleteUserAccount,
};
