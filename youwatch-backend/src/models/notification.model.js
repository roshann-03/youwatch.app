import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who receives it
    type: {
      type: String,
      enum: ["subscribe", "like", "comment", "other"],
      required: true,
    },
    message: String,
    link: String, // Optional: where to redirect
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
