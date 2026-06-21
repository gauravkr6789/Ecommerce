import jwt from "jsonwebtoken";
import User from "../model/UserSchema.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "No token provided",
        data: null,
        error: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("token :",token)

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid or expired token",
        data: null,
        error: "Unauthorized",
      });
    }

    const user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
        data: null,
        error: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error",
      data: null,
      error: "Internal server error",
    });
  }
};

export default isAuthenticated;