import { io } from "socket.io-client";
import { BACKEND_URL } from "../config";

export let socket;

export const initiateSocketConnection = () => {
  socket = io(BACKEND_URL, {
    withCredentials: true,
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};