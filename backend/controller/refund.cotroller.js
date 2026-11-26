import Payment from "../model/paymentSchema.js";
import Order from "../model/orderschema.model.js";
import razorpay from "../rozerpay/rozerPayConfig.js";
import mongoose from "mongoose";
import Refund from "../model/refund.model.js";

export const createRefundPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    // 1. Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // 2. Validate amount and reason
    const refundAmount = Number(amount);

    if (
      amount === undefined ||
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      !reason?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid amount and reason are required",
      });
    }

    // 3. Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 4. Find payment
    const payment = await Payment.findOne({
      order: order._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 5. Check ownership
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to request refund",
      });
    }

    // 6. Check payment status
    if (payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid payments are eligible for refund",
      });
    }

    // 7. Full refund validation
    if (refundAmount !== payment.amount) {
      return res.status(400).json({
        success: false,
        message: "Only full refund is allowed",
      });
    }

    // 8. Check previous refund
    const existingRefund = await Refund.findOne({
      order: order._id,
      status: {
        $in: ["requested", "processing", "processed"],
      },
    });

    if (existingRefund) {
      return res.status(400).json({
        success: false,
        message: "Refund already requested or processed",
      });
    }

    // 9. Create refund document
    const refund = await Refund.create({
      order: order._id,
      payment: payment._id,
      user: payment.user,
      amount: refundAmount,
      reason: reason.trim(),
    });

    // 10. Response
    return res.status(201).json({
      success: true,
      message: "Refund request created successfully",
      refundDetails: refund,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Refund request creation failed",
      error: err.message,
    });
  }
};


export const getMyRefunds = async (req, res) => {
  try {
    const userId = req.user._id;

    const refunds = await Refund.find({
      user: userId,
    })
      .populate("order", "totalAmount orderStatus")
      .populate("payment", "amount status razorpayPaymentId")
      .sort({ createdAt: -1 });

    if (!refunds.length) {
      return res.status(404).json({
        success: false,
        message: "No refund requests found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund history fetched successfully",
      totalRefunds: refunds.length,
      refunds,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch refund history",
      error: err.message,
    });
  }
};





export const approveRefund = async (req, res) => {
  try {
    const { refundId } = req.params;

    // 1. Validate refund ID
    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund ID",
      });
    }

    // 2. Find refund
    const refund = await Refund.findOne({
      _id: refundId,
      status: "requested",
    });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found or already processed",
      });
    }

    // 3. Find payment
    const payment = await Payment.findById(refund.payment);

    if (!payment || payment.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is not eligible for refund",
      });
    }

    // 4. Validate Razorpay payment ID
    if (!payment.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment ID not found",
      });
    }

    // 5. Update status to processing
    refund.status = "processing";
    await refund.save();

    // 6. Call Razorpay Refund API
    const razorpayResponse = await razorpay.payments.refund(
      payment.razorpayPaymentId,
      {
        notes: {
          refundId: refund._id.toString(),
          orderId: refund.order.toString(),
        },
      }
    );

    // 7. Save Razorpay refund ID
    refund.razorpayRefundId = razorpayResponse.id;

    // 8. Without webhook, use Razorpay API response
    if (razorpayResponse.status === "processed") {
      refund.status = "processed";
      refund.processedAt = new Date();

      await Payment.findByIdAndUpdate(payment._id, {
        status: "refunded",
      });

      await Order.findByIdAndUpdate(refund.order, {
        paymentStatus: "refunded",
      });
    } else if (razorpayResponse.status === "failed") {
      refund.status = "failed";
      refund.failureReason =
        razorpayResponse.error_reason || "Refund failed";
    }

    await refund.save();

    return res.status(200).json({
      success: true,
      message: "Refund API response received successfully",
      refundDetails: refund,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Refund processing failed",
      error: err.message,
    });
  }
};



export const rejectRefund = async (req, res) => {
  try {
    const { refundId } = req.params;

    // 1. Validate refund ID
    if (!mongoose.Types.ObjectId.isValid(refundId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund ID",
      });
    }

    // 2. Find and reject refund
    const refund = await Refund.findOneAndUpdate(
      {
        _id: refundId,
        status: "requested",
      },
      {
        $set: {
          status: "cancelled",
          failureReason: "Refund request rejected by admin",
        },
      },
      { new: true }
    );

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found or cannot be rejected",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund request rejected successfully",
      refundDetails: refund,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject refund",
      error: err.message,
    });
  }
};



export const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate("user", "name email")
      .populate("order", "totalAmount orderStatus paymentStatus")
      .populate("payment", "amount status razorpayPaymentId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All refunds fetched successfully",
      totalRefunds: refunds.length,
      refunds,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch refunds",
      error: err.message,
    });
  }
};

