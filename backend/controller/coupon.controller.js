import Coupon from '../model/couponSchema.model.js'

export const createCoupon = async (
  req,
  res
) => {
  try {

    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate
    } = req.body;

    const existingCoupon =
    await Coupon.findOne({
      code:
      code.toUpperCase()
    });

    if(existingCoupon){

      return res.status(409).json({
        success:false,
        message:
        "Coupon already exists",
        data:null
      });

    }

    const coupon =
    await Coupon.create({

      code:
      code.toUpperCase(),

      discountType,

      discountValue,

      minOrderAmount,

      maxDiscount,

      expiryDate

    });

    return res.status(201).json({
      success:true,
      message:
      "Coupon created successfully",
      data:coupon
    });

  } catch(error){

    return res.status(500).json({
      success:false,
      message:error.message,
      data:null
    });

  }
};

export const applyCoupon =
async(req,res)=>{

 try{

   const {
     code,
     subtotal
   } = req.body;

   const coupon =
   await Coupon.findOne({

      code:
      code.toUpperCase(),

      isActive:true

   });

   if(!coupon){

     return res.status(404).json({
       success:false,
       message:
       "Invalid coupon",
       data:null
     });

   }

   if(
    new Date() >
    coupon.expiryDate
   ){

      return res.status(400).json({
         success:false,
         message:
         "Coupon expired",
         data:null
      });

   }

   if(
    subtotal <
    coupon.minOrderAmount
   ){

      return res.status(400).json({
         success:false,
         message:
         `Minimum order amount is ₹${coupon.minOrderAmount}`,
         data:null
      });

   }

   let discount = 0;

   if(
    coupon.discountType ===
    "percentage"
   ){

      discount =
      subtotal *
      coupon.discountValue /
      100;

      if(
       coupon.maxDiscount
      ){

        discount =
        Math.min(
          discount,
          coupon.maxDiscount
        );

      }

   }
   else{

      discount =
      coupon.discountValue;

   }

   const finalAmount =
   subtotal - discount;

   return res.status(200).json({

      success:true,

      message:
      "Coupon applied successfully",

      data:{
        couponCode:
        coupon.code,

        discount,

        finalAmount
      }

   });

 }catch(error){

    return res.status(500).json({
      success:false,
      message:error.message,
      data:null
    });

 }

};

export const getAllCoupons =
async(req,res)=>{

 try{

   const coupons =
   await Coupon.find();

   return res.status(200).json({

      success:true,

      message:
      "Coupons fetched successfully",

      data:coupons

   });

 }catch(error){

    return res.status(500).json({
      success:false,
      message:error.message,
      data:null
    });

 }

};


export const deleteCoupon =
async(req,res)=>{

 try{

   const coupon =
   await Coupon.findByIdAndDelete(
     req.params.id
   );

   if(!coupon){

      return res.status(404).json({
        success:false,
        message:
        "Coupon not found",
        data:null
      });

   }

   return res.status(200).json({

      success:true,

      message:
      "Coupon deleted successfully",

      data:coupon

   });

 }catch(error){

    return res.status(500).json({
      success:false,
      message:error.message,
      data:null
    });

 }

};