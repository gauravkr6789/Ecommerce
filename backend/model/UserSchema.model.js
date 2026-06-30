import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    //select: false

  },
  confirmPassword: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "delivery"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  googleId: {
    type: String
  },
  avatar: {
    type: String,
    default: "",
  },

}, { timestamps: true });



export default mongoose.model("User", UserSchema);
