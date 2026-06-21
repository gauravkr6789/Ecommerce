import express from 'express'
import { createCoupon,applyCoupon,getAllCoupons,deleteCoupon } from '../controller/coupon.controller.js'

const couponRouter=express.json()

couponRouter.post(
 "/create",
 createCoupon
);

couponRouter.post(
 "/apply",
 applyCoupon
);

couponRouter.get(
 "/all",
 getAllCoupons
);
couponRouter.delete(
 "/:id",
 deleteCoupon
);

export default couponRouter