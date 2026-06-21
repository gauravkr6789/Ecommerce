import express from "express";
import passport from '../services/passport.js'
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getAllUser
} from "../controller/user.controller.js";
import { sendOtp, otpVerification } from "../utils/otp/otp.js";
import isAuthenticated from "../middleware/authmiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const authRouter = express.Router();

// Auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

// OTP
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", otpVerification);

// Password reset
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

// frtchind all users 

authRouter.get("/get-users",isAuthenticated,isAdmin,getAllUser)
// Protected route
authRouter.get("/me", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: "User fetched",
    data: {
      user: req.user,
    },
  });
});

// Google OAuth routes
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔹 Google callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const { user, token } = req.user;

    res.redirect(
      `http://localhost:5173/auth/google/callback?token=${token}&username=${encodeURIComponent(
        user.username
      )}&avatar=${encodeURIComponent(user.avatar)}&role=${user.role}`
    );
  }
);

export default authRouter