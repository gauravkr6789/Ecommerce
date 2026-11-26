import crypto from "crypto";
import Payment from "../model/paymentSchema.js";
import Order from "../model/orderschema.model.js";
import razorpay from "../rozerpay/rozerPayConfig.js";
import mongoose from "mongoose";


export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.totalAmount || order.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // Already created payment order
    if (order.razorpayOrderId) {
      const existingPayment = await Payment.findOne({
        razorpayOrderId: order.razorpayOrderId,
      });

      return res.status(200).json({
        success: true,
        message: "Payment order already exists",
        orderId: order._id,
        razorpayOrderId: order.razorpayOrderId,
        amount: order.totalAmount,
        currency: "INR",
        payment: existingPayment,
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: "INR",
      status: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: "INR",
      payment,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      payment.failureReason = "Invalid payment signature";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({
      _id: payment.order,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Idempotency
    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
        payment,
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.paidAt = new Date();

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "paid";
    order.orderStatus = "placed";
    order.paidAt = new Date();

    await Promise.all([payment.save(), order.save()]);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



