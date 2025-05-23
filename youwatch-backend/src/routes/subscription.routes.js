import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  isSubscribing,
  getSubscribingChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/subscribed-channels").get(getSubscribingChannels);

router.route("/c/:subscription-status/:channelId").get(isSubscribing);

router.route("/u/:channelId").get(getUserChannelSubscribers);
// router.route("/u/")
export default router;
