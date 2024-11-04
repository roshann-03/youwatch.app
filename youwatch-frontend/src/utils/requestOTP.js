import axios from "axios";

export const requestOTP = async (email) => {
    const apiUrl = "http://localhost:8000/api/v1/otp/send";
    try {
      const response = await axios.post(
        apiUrl,
        { email }
      );
      return response;
    } catch (error) {
      console.error("Error requesting OTP:", error);
      throw error;
    }
  };
  