import jwt from "jsonwebtoken";
import User from "../model/UserSchema.model.js";

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("no token provided"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return next(new Error("user not found !"));
    }

    if (!user.isActive) {
      return next(new Error("Account is inactive"));
    }

    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
};

export default socketAuth;
