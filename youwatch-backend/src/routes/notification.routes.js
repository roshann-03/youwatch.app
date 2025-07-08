// const notifyUser = require("../utils/notifyUser.js");
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
const router = express.Router();

router.get("/", verifyJWT, async (req, res) => {
  const notifications = await Notification.find({ receiverUserId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(
    new ApiResponse(200, notifications, "Notification fetched successfully")
  );
});

router.post("/mark-read", verifyJWT, async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findOneAndUpdate(
      { receiverUserId: req.user.id, _id: notificationId },
      { $set: { isRead: true } }
    );
    res.json(new ApiResponse(200, { isRead: true }, "Mark read successfully"));
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw new ApiError(501, "Failed to marking notification as read");
  }
});

export default router;
