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
    const AdminTotalOrders = await Order.countDocuments();

    return res.status(200).json({
      message: "User orders fetched successfully",
      status: "success",
      success: true,

      orders,
      AdminTotalOrders,
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

    const { source, productId, quantity, shippingAddress, couponId, code } =
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
      const cart = await Cart.findOne({
        user: userId,
      });

      if (!cart) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "cart not found",
        });
      }

      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "cart is empty",
        });
      }

      const productIds = cart.items.map((item) => item.product);

      const products = await Product.find({
        _id: { $in: productIds },
      }).lean();

      const productMap = new Map(
        products.map((product) => [product._id.toString(), product]),
      );

      for (const item of cart.items) {
        const product = productMap.get(item.product.toString());

        if (!product) {
          return res.status(404).json({
            success: false,
            status: 404,
            message: `product ${item.product} not found`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: `insufficient stock for ${product.name}`,
          });
        }

        const price = product.price;

        orderItems.push({
          product: product._id,
          name: product.name,
          price,
          quantity: item.quantity,
          subtotal: price * item.quantity,
        });
      }
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

    const subtotal = orderItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    let discountPrice = 0;
    let coupon = null;

    if (couponId) {
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

      coupon = result.coupon;

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: `minimum order amount is ${coupon.minOrderAmount}`,
        });
      }

      if (coupon.discountType === "percentage") {
        discountPrice = (subtotal * coupon.discountValue) / 100;

        if (coupon.maxDiscount && discountPrice > coupon.maxDiscount) {
          discountPrice = coupon.maxDiscount;
        }
      }

      // Fixed discount
      else if (coupon.discountType === "fixed") {
        discountPrice = coupon.discountValue;
      }

      // Discount cannot exceed subtotal
      if (discountPrice > subtotal) {
        discountPrice = subtotal;
      }
    }

    const totalAmount = subtotal - discountPrice;

    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress,

      coupon: coupon ? coupon._id : null,

      couponCode: coupon ? coupon.code : null,

      discount: discountPrice,

      subtotal,

      totalAmount,

      paymentStatus: "pending",

      orderStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create Order Error:", err);

    return res.status(500).json({
      success: false,
      status: 500,
      message: "create order error",
      error: err.message,
    });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .select(
        "user orderStatus paymentStatus deliveryStatus deliveryPartner createdAt deliveredAt",
      )
      .populate("deliveryPartner", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check order ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order tracking fetched successfully",
      tracking: {
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        deliveryPartner: order.deliveryPartner,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
