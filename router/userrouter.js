import express from 'express'
import { registerUser,loginUser,logoutUser } from '../controller/user.controller.js'
import { sendOtp,otpVerification} from '../utils/otp/otp.js'
//import { generateOtp } from '../utils/otp/generateOtp.js'
import {forgotPassword} from '../forgotpassword/forgotpassword.js'
import {resetPassword,resetPasswordPage} from '../forgotpassword/resetpassword.js'
const authRouter=express.Router()
authRouter.post('/register',registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)
authRouter.post('/send-otp',sendOtp)
authRouter.post('/verify-otp',otpVerification)
//authRouter.post('/generate-otp',generateOtp)
authRouter.post('/forget-password',forgotPassword)
authRouter.get('/reset-password/:token', resetPasswordPage);
authRouter.post('/reset-password/:token', resetPassword);
export default authRouter