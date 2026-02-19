import User from "../model/UserSchema.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/Token/token.js";


export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
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
      password: hashedPassword
    });

    const token = generateToken(user._id);

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
        error: "User not found"
      });
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

    const token = generateToken(user._id);

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



// ======================
// LOGOUT USER
// ======================
export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Logout successful",
    data: null,
    error: null
  });
};
