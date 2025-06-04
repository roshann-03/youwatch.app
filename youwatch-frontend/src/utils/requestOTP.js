import axios from "axios";
import { axiosJSON } from "../api/axiosInstances.js";
export const requestOTP = async (email) => {
  try {
    const response = await axiosJSON.post("/otp/send", { email });
    return response;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
};
