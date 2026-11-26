import { Server } from "socket.io";
import socketAuth from "../middleware/socket.auth.middleware.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(
        Boolean,
      ),
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const user = socket.data.user;

    console.log("Socket connected:", socket.id);
    console.log("Authenticated user:", user._id);
    console.log("User role:", user.role);

    if (user.role === "admin") {
      socket.join("admin");
    }

    if (user.role === "user") {
      socket.join(`user_${user._id}`);
    }

    if (user.role === "delivery") {
      socket.join(`delivery_${user._id}`);
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  return io;
};

export default initializeSocket;