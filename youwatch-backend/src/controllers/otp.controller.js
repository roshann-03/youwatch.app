import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid only for 5 minutes. Do not share this code with anyone.`,
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

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "OTP verified"));
  } else {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }
});
