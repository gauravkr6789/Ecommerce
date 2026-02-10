import User from "../model/UserSchema.model.js";
import crypto from 'crypto'
import { sendEmail } from "../services/email.services.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email not found",
        success: false
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const BASE_URI = process.env.BASE_URL || "http://localhost:3500";
    const resetUrl = `${BASE_URI}/api/auth/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>Click below link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 10 minutes.</p>
    `;

    try {
      const result = await sendEmail({
        to: user.email,
        subject: "Password Reset Link",
        html: message
      });

      if (!result.success) {
        throw new Error(result.message || "Email send failed");
      }

      res.status(200).json({
        message: "Reset link sent successfully",
        success: true,
        resetUrl

      });

    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "Email could not be sent",
        error: emailErr.message,
        success: false
      });
    }

  } catch (err) {
    res.status(500).json({
      message: "Sending reset link error",
      error: err.message,
      success: false
    });
  }
};