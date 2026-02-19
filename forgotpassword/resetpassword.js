
import User from '../model/UserSchema.model.js';
import crypto from 'crypto'

export const resetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send(`
        <h2>Reset Link Invalid or Expired</h2>
        <p>Please request a new password reset link.</p>
      `);
    }

    res.send(`
      <h2>Password Reset Link Valid</h2>
      <p>Now send a POST request to this same URL with new password in body.</p>
    `);
  } catch (err) {
    res.status(500).send(`
      <h2>Server Error</h2>
      <p>${err.message}</p>
    `);
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token from URL to match what's stored in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    
    // Find user with matching hashed token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
        success: false
      });
    }
    
    // Validate and update password
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false
      });
    }
    user.password = password; // Make sure this is hashed in your pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.status(200).json({
      message: "Password reset successful",
      success: true
    });
    
  } catch (err) {
    res.status(500).json({
      message: "Password reset error",
      error: err.message,
      success: false
    });
  }
};