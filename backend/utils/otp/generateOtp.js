
import bcrypt from 'bcrypt';

export const generateOtp = async (digits = 6) => {
  let otp = '';
  for (let i = 0; i < digits; i++) {
    otp += Math.floor(Math.random() * 10).toString(); 
  }

  const hashedOtp = await bcrypt.hash(otp, 10);

  return {otp,hashedOtp}; 
};
