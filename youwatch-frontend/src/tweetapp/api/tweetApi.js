import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/tweets`,
  withCredentials: true, // to send cookies (JWT)
});

export const createTweet = (data) => API.post("/", data);
export const getUserTweets = (userId) => API.get(`/user/${userId}`);
export const updateTweet = (tweetId, data) => API.patch(`/${tweetId}`, data);
export const deleteTweet = (tweetId) => API.delete(`/${tweetId}`);
export const getAllTweets = () => API.get("/all");
