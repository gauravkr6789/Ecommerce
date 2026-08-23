import mongoose from "mongoose";
import Order from "../model/orderschema.model.js";
import Cart from "../model/cartSchema.js";
import Product from "../model/productschema.model.js";
import { validateCoupon } from "../utils/validateCoupon/validateCoupon.js";

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.product", "name images")
        .populate("coupon", "code discountType discountValue")
        .lean(),

      Order.countDocuments({ user: userId }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      message: "User orders fetched successfully",
      status: "success",
      success: true,

      orders,

      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
        status: "fail",
        success: false,
      });
    }

    // User restriction directly in query
    const order = await Order.findOne({
      _id: id,
      user: userId,
    })
      .populate("items.product", "name images")
      .populate("coupon", "code discountType discountValue")
      .populate("user", "username email")
      .lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      status: "success",
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { source, productId, quantity, shippingAddress, couponId, options } =
      req.body;

    if (!source) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "source is required",
      });
    }

    if (!["cart", "buyNow"].includes(source)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "invalid source",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "shipping address is required",
      });
    }

    let orderItems = [];

    if (source === "cart") {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "cart not found",
        });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "cart is empty",
        });
      }

      orderItems = cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));
    }

    if (source === "buyNow") {
      if (!productId) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "productId is required",
        });
      }

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "valid quantity is required",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "insufficient stock",
        });
      }

      orderItems = [
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity,
        },
      ];
    }

    let subtotal = 0;

    for (const item of orderItems) {
      subtotal += item.subtotal;
    }

    let discountPrice = 0;
    let coupon = null;

    if (couponId) {
      const result = await validateCoupon({
        couponId,
        code: req.body.code,
        userId,
      });

      if (!result.valid) {
        return res.status(result.status).json({
          success: false,
          status: result.status,
          message: result.message,
        });
      }

      coupon = result.coupon;

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: `minimum order amount is ${coupon.minOrderAmount}`,
        });
      }

      discountPrice = calculateDiscountPrice(subtotal, coupon);
    }

    const totalAmount = subtotal - discountPrice;

    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress,

      subtotal,

      discount: discountPrice,

      totalAmount,

      coupon: coupon ? coupon._id : null,

      options: options || {},

      source,

      status: "pending",
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "order created successfully",

      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "create order error",
      error: err.message,
    });
  }
};
