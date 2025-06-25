import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateAccessAndRefereshTokens from "../utils/generateAccessRefreshToken.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthController = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  try {
    // Attempt to verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;
    // If email is not verified, throw an error
    if (!email_verified) {
      throw new ApiError(403, "Email not verified by Google");
    }

    // Find or create the user in the database
    let user = await User.findOne({ email });

    // Prevent user login with direct google if already exists
    // if (user || !user?.isGoogleUser) {
    //   return res
    //     .status(409)
    //     .json(new ApiError(409, "User with email or username already exists"));
    // }

    let hasPassword = false;
    if (!user) {
      const randomPassword = await bcrypt.hash(uuidv4(), 10); // Safe, hashed garbage password
      user = await User.create({
        email,
        fullName: name,
        avatar: picture,
        username: email.split("@")[0],
        isGoogleUser: true,
        password: randomPassword,
        hasPassword: false,
      });
    } else {
      hasPassword = true;
    }
    // console.log(user);
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );
    console.log(user.avatar);

    // Send tokens as HTTP-only cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true only for production,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for production, "Lax" for development
    };
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          username: user.username,
          isGoogleUser: user.isGoogleUser,
          hasPassword: hasPassword,
        },
      });
  } catch (error) {
    // Catch any errors that happen during token verification or user creation
    console.error("Error during Google Auth:", error.message);
    throw new ApiError(401, "Google token verification failed"); // Unauthorized
  }
});
