import User from "../model/UserSchema.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/Token/token.js";
import crypto from "crypto";
import { sendEmail } from "../services/email.services.js"


export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password,role,confirmPassword} = req.body;

    if (!username || !email ||!password || !role || !phone ) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All fields are required",
        data: null,
        error: "Missing required fields"
      });
    }

    const existingUser = await User.findOne({ email: email.trim() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "User already exists",
        data: null,
        error: "Duplicate email"
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role:role.trim(),
      confirmPassword:confirmPassword.trim()
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      error: null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
      error: error.message
    });
  }
};




export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Email and password are required",
        data: null,
        error: "Missing credentials"
      });
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
        data: null,
        error: "User not found",
      
      })
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
        data: null,
        error: "Password incorrect"
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      error: null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
      error: error.message
    });
  }
};




export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Logout successful",
    data: null,
    error: null
  });
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Email is required",
        data: null,
        error: "Missing email"
      });
    }

    const user = await User.findOne({ email: email.trim() });

    // Security: Don't reveal if email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "If this email exists, a reset link has been sent",
        data: null,
        error: null
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    // 🔗 Direct link to frontend reset page
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    const emailResponse = await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html
    });

    if (!emailResponse.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to send reset email",
        data: null,
        error: "Email service failed"
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Reset link sent to your email. Click it to reset password.",
      data: null,
      error: null,
      resetUrl
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while processing request",
      data: null,
      error: error.message
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
      error: error.message,
    });
  }
};

export const getAllUser=async(req,res)=>{
  try{
    const fetchUser=await User.find()

    if(!fetchUser){
      return res.status(404).json({
        status:404,
        message:"user not found",
        success:false
      })
    }

    return res.status(200).json({
         status:200,
         message:"fetching all users.....",
         success:true,
         data:fetchUser
    })

  }
  catch(err){
       return res.status(500).json({
      success: false,
      message: "Server error while fetching all users",
      error: error.message,
    });
  }
}