import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error (frontend):", err.message);
});
