// socket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false, // prevent auto connect
      transports: ["websocket", "polling"],
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error (frontend):", err.message);
    });

    socket.connect(); // manually connect
  }
};
