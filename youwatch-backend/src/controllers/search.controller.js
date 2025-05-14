import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;
  console.log(query);
  if (!query || query.trim() === "") {
    return res.status(400).json(new ApiError(400, "Search query is required"));
  }

  const regex = new RegExp(query, "i"); // i = case-insensitive

  const users = await User.find({
    $or: [{ username: regex }, { fullName: regex }],
  }).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});
