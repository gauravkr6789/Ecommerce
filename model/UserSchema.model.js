import mongoose from 'mongoose'
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin"]

    },
    address:[{
        street: String,
        city: String,
        state: String,
        pinCode: String,
        country: String

    }],
    isActive: {
      type: Boolean,
      default: true
    },
    passwordResetToken:{
      type:String
    } ,
    passwordResetExpires:{
      type:Date
    },
    
  }
,{timestamps:true})

const User=mongoose.model('user',UserSchema)
export default User