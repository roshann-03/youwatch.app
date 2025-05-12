import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    //Find a user by id
    const user = await User.findById(userId);
    //generate access token and refresh token using User model methods
    const accessToken = user.generateAccessToken(); // Method that generate access token
    const refreshToken = user.generateRefreshToken(); // Method that generate refresh token

    //Save refresh token in user database.
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    //return access and refresh token
    return { accessToken, refreshToken };
  } catch (error) {
    // If there is an error

    // Throw an error with status code 500 Internal server error
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
export default generateAccessAndRefereshTokens;
