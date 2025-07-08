// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : process.env.DEV_CORS_ORIGIN,
    credentials: true,
  },
});

export const connectedUsers = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err.message);
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

async function startServer() {
  let retries = 5;
  while (retries > 0) {
    try {
      await connectDB();
      server.listen(process.env.PORT || 5000, async () => {
        console.log(
          `⚙️ Server is running at url : http://localhost:${process.env.PORT}`
        );
      });

      break;
    } catch (error) {
      console.error("MONGO db connection failed !!!", error);
      retries--;
      console.log(`Retrying to connect... (${5 - retries}/5)`);
      await sleep(5000);

      if (retries <= 0) {
        console.error("Unable to connect to the database");
        try {
          await mongoose.disconnect();
        } catch (e) {
          console.error("Error while disconnecting:", e);
        }
        process.exit(1);
      }
    }
  }
}

startServer();
