import express from "express";
import {
  createCoupon,
  getCoupon,
  getCouponById,
  applyCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controller/coupon.controller.js";
import isAuthenticated from "../middleware/authmiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const couponRouter = express.Router();

couponRouter.post("/create", isAuthenticated, isAdmin, createCoupon);
couponRouter.get(
  "/get-coupon/:couponId",
  isAuthenticated,
  isAdmin,
  getCouponById,
);
couponRouter.get("get-coupon", isAuthenticated, isAdmin, getCoupon);
couponRouter.post("/apply", isAuthenticated, applyCoupon);
couponRouter.put("/update", isAuthenticated, isAdmin, updateCoupon);
couponRouter.delete("/delete", isAuthenticated, isAdmin, deleteCoupon);

export default couponRouter;
