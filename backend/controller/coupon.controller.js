import Coupon from "../model/couponSchema.model.js";
import Cart from "../model/cartSchema.js";
import calculateDiscountPrice from "../utils/discount/calculateDiscount.js";
import { validateCoupon } from "../utils/validateCoupon/validateCoupon.js";
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Required coupon fields are missing",
        error: "Validation error",
        coupon: null,
      });
    }

    if (code.length < 6) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "code length must be 6 length",
      });
    }

    const findCoupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (findCoupon) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "This coupon already exists",
        error: "Duplicate coupon",
        coupon: null,
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    const newCoupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate: expiresAt,
      usageLimit,
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Coupon created successfully",
      error: null,
      coupon: newCoupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error",
      error: err.message,
      coupon: null,
    });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "coupon fetched successfully",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "coupon fetch error",
      error: err.message,
    });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "coupons fetched successfully",
      coupons,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "coupons fetch error",
      error: err.message,
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const {
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "coupon not found",
      });
    }

    if (discountType !== undefined) {
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      coupon.discountValue = discountValue;
    }

    if (minOrderAmount !== undefined) {
      coupon.minOrderAmount = minOrderAmount;
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount = maxDiscount;
    }

    if (startDate !== undefined) {
      coupon.startDate = startDate;
    }

    if (expiryDate !== undefined) {
      coupon.expiryDate = expiryDate;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = usageLimit;
    }

    if (isActive !== undefined) {
      coupon.isActive = isActive;
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "coupon updated successfully",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "coupon update error",
      error: err.message,
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { couponId } = req.params;
    const userId = req.user._id;

    // Coupon validation
    const result = await validateCoupon({
      couponId,
      code,
      userId,
    });

    if (!result.valid) {
      return res.status(result.status).json({
        success: false,
        status: result.status,
        message: result.message,
      });
    }

    const coupon = result.coupon;

    // Find cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "cart not found",
      });
    }

    // Calculate subtotal
    let subtotal = 0;

    for (let itemIdx = 0; itemIdx < cart.items.length; itemIdx++) {
      const item = cart.items[itemIdx];

      subtotal += item.price * item.quantity;
    }

    // Calculate discount
    const discountPrice = calculateDiscountPrice(subtotal, coupon);

    const totalAmount = subtotal - discountPrice;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "coupon applied successfully",
      discountPrice,
      subtotal,
      totalAmount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "coupon apply error",
      error: err.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "coupon deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "coupon deletion error",
      error: err.message,
    });
  }
};

export const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon found",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
