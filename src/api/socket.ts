import { io } from "socket.io-client";

// Ensure this matches your backend URL
const SOCKET_URL = "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});
