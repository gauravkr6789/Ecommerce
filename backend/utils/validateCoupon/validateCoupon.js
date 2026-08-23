import Coupon from "../../model/couponSchema.model.js";
import CouponUsage from "../../model/couponUsageSchema.js";

export const validateCoupon = async ({ couponId, code, userId }) => {
  if (!code) {
    return {
      valid: false,
      status: 400,
      message: "coupon code missing",
    };
  }

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    return {
      valid: false,
      status: 404,
      message: "coupon not found",
    };
  }

  if (coupon.expiryDate < Date.now()) {
    return {
      valid: false,
      status: 400,
      message: "coupon expired",
    };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return {
      valid: false,
      status: 400,
      message: "coupon limit reached",
    };
  }

  const count = await CouponUsage.countDocuments({
    userId,
    couponId,
  });

  if (count >= 1) {
    return {
      valid: false,
      status: 400,
      message: "coupon already used",
    };
  }

  if (coupon.code !== code) {
    return {
      valid: false,
      status: 400,
      message: "coupon code mismatch",
    };
  }

  return {
    valid: true,
    status: 200,
    coupon,
  };
};
