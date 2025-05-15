// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";

dotenv.config();

async function startServer() {
  let retries = 5;
  while (retries > 0) {
    try {
      await connectDB();
      0;
      app.listen(process.env.PORT || 8000, async () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      });

      break;
    } catch (error) {
      console.log("MONGO db connection failed !!!", error);
      retries--;
      if (retries <= 0) {
        console.log("Unable to connect to the database");
        mongoose.disconnect();
        process.exit(1);
      }
    }
  }
}

startServer();
