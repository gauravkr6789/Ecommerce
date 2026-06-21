import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  items:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      quantity:{
        type:Number,
        required:true
      },
      price:{
        type:Number,
        required:true
      }
    }
  ],

  shippingAddress:{
    fullName:String,
    phone:String,
    address:String,
    city:String,
    state:String,
    pincode:String
  },
  coupon:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Coupon"
},

discount:{
 type:Number,
 default:0
},

subtotal:Number,

totalAmount:Number,

  

  razorpayOrderId:String,

  razorpayPaymentId:String,

  paymentStatus:{
    type:String,
    enum:[
      "pending",
      "paid",
      "failed",
      "refunded"
    ],
    default:"pending"
  },

  deliveryPartner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

deliveredAt: Date,

trackingNumber: {
  type: String,
  default: null
},

  orderStatus:{
    type:String,
    enum:[
      "placed",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default:"placed"
  }

},

{
 timestamps:true
});

export default mongoose.model(
 "Order",
 orderSchema
);