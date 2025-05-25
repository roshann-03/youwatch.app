// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";

dotenv.config();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function startServer() {
  let retries = 5;
  while (retries > 0) {
    try {
      await connectDB();
      app.listen(process.env.PORT || 8000, async () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      });
      break;
    } catch (error) {
      console.log("MONGO db connection failed !!!", error);
      retries--;
      console.log(`Retrying to connect... (${5 - retries}/5)`);
      await sleep(5000);

      if (retries <= 0) {
        console.log("Unable to connect to the database");
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
