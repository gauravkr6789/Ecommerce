import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!token) {
    console.log("Socket token missing");
    return;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io("http://localhost:3500", {
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
