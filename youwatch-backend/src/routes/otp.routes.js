import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";
const router = express.Router();

router.route("/send").post(sendOTP);
router.route("/verify").post(verifyOTP);

export default router;
