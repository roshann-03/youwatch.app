import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(
    `${process.env.MONGODB_URI}/`
  );
  console.log(
    `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
  );
};

export default connectDB;
