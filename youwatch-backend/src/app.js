import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { ApiError } from "./utils/ApiError.js";
import passport from "passport";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://youwatch-api.onrender.com",
    credentials: true,
    // sameSite: "None",
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); //{limit: "16kb"}
app.use(express.urlencoded()); // {extended: true, limit: "16kb"}
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());

//routes import
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import OTPRouter from "./routes/otp.routes.js";
import searchRouter from "./routes/search.routes.js";

//routes declaration

//user routes
// app.use("/auth", authRoutes);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/otp", OTPRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/search", searchRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
  // Check if error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // Generic internal server error handling
  console.error(err.stack); // Log the error stack for debugging
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
