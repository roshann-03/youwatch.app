import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateAccessAndRefereshTokens from "../utils/generateAccessRefreshToken.js";

let otpStore = {}; // Store OTPs temporarily

// Endpoint to request OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "Email is required"));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expirationTime = Date.now() + 5 * 60 * 1000; // Set expiration time for 5 minutes

  otpStore[email] = { otp, expirationTime }; // Store OTP and its expiration time

  // Set up nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your One-Time Password (OTP) for YouWatch",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #1A73E8;">Hello,</h2>
      <p style="font-size: 16px;">We’ve received a request to verify your identity with a One-Time Password (OTP) for YouWatch. Please use the following code to proceed:</p>
      
      <div style="background-color: #F4F7FB; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="color: #1A73E8; font-size: 36px; margin: 0;">${otp}</h3>
        <p style="font-size: 16px; margin-top: 10px;">This code is valid for 5 minutes only.</p>
      </div>

      <p style="font-size: 16px;">Please note: <strong>Never share this OTP with anyone</strong>. If you did not request this OTP, please ignore this email.</p>
      
      <p style="font-size: 16px;">If you have any questions, feel free to reach out to our support team.</p>

      <p style="font-size: 16px;">Best regards, <br/> The YouWatch Team</p>

      <footer style="margin-top: 20px; font-size: 12px; color: #888;">
        <p>YouWatch, Inc. | 1234 Street Name, City, Country</p>
        <p><a href="https://www.youwatch.com/privacy" style="color: #1A73E8;">Privacy Policy</a> | <a href="https://www.youwatch.com/terms" style="color: #1A73E8;">Terms of Service</a></p>
      </footer>
    </div>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      return res.status(200).json(new ApiResponse(200, null, "OTP sent"));
    }
    return res.status(409).json(new ApiError(409, "Failed to send OTP"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Failed to send OTP"));
  }
});

// Endpoint to verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp, user } = req.body;
  const email = user.email;

  if (!email || !otp) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and OTP are required"));
  }

  const storedData = otpStore[email];
  if (!storedData) {
    return res
      .status(400)
      .json(new ApiError(400, "No OTP generated for this email"));
  }

  const { otp: receivedOtp, expirationTime } = storedData; // Using 'receivedOtp' for clarity

  // Check if the OTP is expired
  if (Date.now() > expirationTime) {
    delete otpStore[email]; // Remove expired OTP
    return res
      .status(410)
      .json(new ApiError(410, "OTP has expired. Please request a new one."));
  }

  if (receivedOtp === otp) {
    delete otpStore[email]; // Remove OTP after verification

    const newUser = await User.create({
      fullName: user.fullName,
      avatar: user.avatar,
      coverImage: user.coverImage,
      email: user.email,
      password: user.password,
      username: user.username,
      isGoogleUser: false,
    });

    if (!newUser) {
      return res
        .status(500)
        .json(new ApiError(500, "Error while registering the user"));
    }

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res
        .status(500)
        .json(new ApiError(500, "Error fetching the created user"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id
    );
    const options = {
      httpOnly: true,
      secure: true, // Set to false if not using HTTPS during development
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, createdUser, "OTP verified"));
  } else {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }
});
