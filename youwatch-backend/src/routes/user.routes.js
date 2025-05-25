import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
  resetPassword,
  forgotPassword,
  deleteUserAccount,
  setPasswordController,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { googleAuthController } from "../controllers/googleauth.controller.js";

const router = Router(); //make an instance of Router();

//Register route using post request
router.route("/register").post(
  //using multer for file/images upload
  //uploading 2 images avatar and cover image
  //using upload middleware and fields
  upload.fields([
    {
      //image name
      name: "avatar",
      //max image
      maxCount: 1,
    },
    {
      //image name
      name: "coverImage",
      //max image
      maxCount: 1,
    },
  ]),
  //registerUser controller
  registerUser
);

router.route("/login").post(loginUser);

router.get("/status", (req, res) => {
  // Check if user is authenticated by verifying cookies
  if (req.cookies.accessToken) {
    return res.status(200).json({ message: "User is logged in" });
  } else {
    return res.status(401).json({ message: "User is not logged in" });
  }
});

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/auth/google-auth").post(googleAuthController);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

router.delete("/delete-account", verifyJWT, deleteUserAccount);
router.post("/set-password", setPasswordController);
export default router;
