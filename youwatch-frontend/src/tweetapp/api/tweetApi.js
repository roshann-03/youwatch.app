import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/tweets`,
  withCredentials: true, // to send cookies (JWT)
});

const FormAPI = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/tweets`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

export const createTweet = (content) => API.post("/", content);

// export const uploadImage = (formData) =>
//   FormAPI.post("/upload-image", formData);

export const getUserTweets = (userId) => API.get(`/user/${userId}`);
export const updateTweet = (tweetId, data) => API.patch(`/${tweetId}`, data);
export const deleteTweet = (tweetId) => API.delete(`/${tweetId}`);
export const getAllTweets = async (page = 1, limit = 10) => {
  return API.get(`/all?page=${page}&limit=${limit}`);
};
