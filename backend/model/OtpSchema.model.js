import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // 🔥 TTL
  attempts: { type: Number, default: 0 }
}, { timestamps: true });


const OtpModel = mongoose.model('Otp', otpSchema);
export default OtpModel;