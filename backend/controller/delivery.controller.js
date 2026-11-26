
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../model/UserSchema.model.js";
import Order from "../model/orderschema.model.js";
import { sendEmail } from "../services/email.services.js";
import { generateOtp } from "../utils/otp/generateOtp.js";
import { getIO } from "../socket/socket.js";

// 1. ADMIN ASSIGNS DELIVERY PARTNER
export const adminDeliveryPartner = async (req, res) => {
  try {
    const { orderId, deliveryPartnerId } = req.body;

    if (!orderId || !deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and Delivery Partner ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(deliveryPartnerId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID or Delivery Partner ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order payment is not completed",
      });
    }

    if (
      order.orderStatus === "cancelled" ||
      order.orderStatus === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be assigned",
      });
    }

    const deliveryPartner = await User.findById(deliveryPartnerId);

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (deliveryPartner.role !== "delivery") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a delivery partner",
      });
    }

    if (deliveryPartner.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner is inactive",
      });
    }

    // Existing assignment check
    if (order.deliveryPartner && order.deliveryStatus !== "rejected") {
      return res.status(409).json({
        success: false,
        message: "Order is already assigned to a delivery partner",
      });
    }

    // Do not assign the same rejected partner again
    if (
      order.deliveryPartner &&
      order.deliveryPartner.toString() === deliveryPartnerId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please assign a different delivery partner",
      });
    }

    order.deliveryPartner = deliveryPartner._id;
    order.deliveryStatus = "assigned";

    await order.save();

    // Notify assigned delivery partner
    const io = getIO();

    io.to(`delivery_${deliveryPartner._id}`).emit(
      "new-delivery-assigned",
      {
        orderId: order._id,
        deliveryPartnerId: deliveryPartner._id,
        deliveryStatus: order.deliveryStatus,
        message: "A new delivery has been assigned to you",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Delivery partner assigned successfully",
      order: {
        orderId: order._id,
        deliveryPartner: order.deliveryPartner,
        deliveryStatus: order.deliveryStatus,
      },
    });
  } catch (error) {
    console.error("Assign delivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 2. GET ASSIGNED ORDERS FOR DELIVERY PARTNER
export const getAssignedOrders = async (req, res) => {
  try {
    const deliveryPartnerId = req.user._id;

    const orders = await Order.find({
      deliveryPartner: deliveryPartnerId,
      deliveryStatus: {
        $in: ["assigned", "accepted", "picked-up", "out-for-delivery"],
      },
    })
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message:
        orders.length === 0
          ? "No assigned orders found"
          : "Assigned orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get assigned orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 3. DELIVERY PARTNER ACCEPTS ASSIGNMENT
export const acceptDeliveryAssignment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const deliveryPartnerId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== deliveryPartnerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This order is not assigned to you",
      });
    }

    // Check deliveryStatus, not orderStatus
    if (order.deliveryStatus !== "assigned") {
      return res.status(400).json({
        success: false,
        message: "Order is not available for acceptance",
      });
    }

    order.deliveryStatus = "accepted";

    await order.save();

    // Notify admin
    const io = getIO();

    io.to("admin").emit("delivery-accepted", {
      orderId: order._id,
      deliveryPartnerId: order.deliveryPartner,
      deliveryStatus: order.deliveryStatus,
      message: "Delivery partner accepted the order",
    });

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      deliveryStatus: order.deliveryStatus,
    });
  } catch (error) {
    console.error("Accept delivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 4. DELIVERY PARTNER REJECTS ASSIGNMENT
export const rejectDeliveryAssignment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This order is not assigned to you",
      });
    }

    if (order.deliveryStatus !== "assigned") {
      return res.status(400).json({
        success: false,
        message: "This order cannot be rejected now",
      });
    }

    order.deliveryStatus = "rejected";

    await order.save();

    // Notify admin
    const io = getIO();

    io.to("admin").emit("delivery-rejected", {
      orderId: order._id,
      deliveryPartnerId: order.deliveryPartner,
      deliveryStatus: order.deliveryStatus,
      message: "Delivery partner rejected the order",
    });

    return res.status(200).json({
      success: true,
      message: "Delivery assignment rejected successfully",
      deliveryStatus: order.deliveryStatus,
    });
  } catch (error) {
    console.error("Reject delivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 5. DELIVERY PARTNER MARKS ORDER AS PICKED UP
export const markAsPickedUp = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This order is not assigned to you",
      });
    }

    if (order.deliveryStatus !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted orders can be picked up",
      });
    }

    order.deliveryStatus = "picked-up";

    await order.save();

    const io = getIO();

    const orderData = {
      orderId: order._id,
      orderStatus: order.orderStatus,
      deliveryStatus: order.deliveryStatus,
      deliveryPartnerId: order.deliveryPartner,
      message: "Your order has been picked up",
    };

    // Notify admin and customer
    io.to("admin").emit("delivery-status-updated", orderData);

    io.to(`user_${order.user}`).emit(
      "delivery-status-updated",
      orderData
    );

    return res.status(200).json({
      success: true,
      message: "Order picked up successfully",
      deliveryStatus: order.deliveryStatus,
    });
  } catch (error) {
    console.error("Pickup order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 6. DELIVERY PARTNER MARKS ORDER OUT FOR DELIVERY
export const markOutForDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    if (order.deliveryStatus !== "picked-up") {
      return res.status(400).json({
        success: false,
        message: "Only picked-up orders can be marked out for delivery",
      });
    }

    order.deliveryStatus = "out-for-delivery";

    await order.save();

    const io = getIO();

    const orderData = {
      orderId: order._id,
      orderStatus: order.orderStatus,
      deliveryStatus: order.deliveryStatus,
      deliveryPartnerId: order.deliveryPartner,
      message: "Your order is out for delivery",
    };

    // Notify admin and customer
    io.to("admin").emit("delivery-status-updated", orderData);

    io.to(`user_${order.user}`).emit(
      "delivery-status-updated",
      orderData
    );

    return res.status(200).json({
      success: true,
      message: "Order is out for delivery",
      order: {
        orderId: order._id,
        deliveryStatus: order.deliveryStatus,
      },
    });
  } catch (error) {
    console.error("Out for delivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// 7. SEND DELIVERY OTP TO CUSTOMER
export const sendDeliveryOTP = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    if (order.deliveryStatus !== "out-for-delivery") {
      return res.status(400).json({
        success: false,
        message: "Order is not out for delivery",
      });
    }

    const customer = await User.findById(order.user);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.email) {
      return res.status(400).json({
        success: false,
        message: "Customer email not found",
      });
    }

    const { otp, hashedOtp } = await generateOtp();

    order.deliveryOTP = hashedOtp;
    order.deliveryOTPExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );
    order.deliveryOTPAttempts = 0;

    await order.save();

    await sendEmail({
      to: customer.email,
      subject: "Your Delivery Verification OTP",
      html: `
        <h2>Delivery Verification</h2>
        <p>Your delivery OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Please share this OTP with the delivery partner only when you receive your order.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery OTP sent successfully",
    });
  } catch (error) {
    console.error("Send delivery OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send delivery OTP",
      error: error.message,
    });
  }
};


// 8. VERIFY DELIVERY OTP AND COMPLETE ORDER
export const verifyDeliveryOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    if (order.deliveryStatus !== "out-for-delivery") {
      return res.status(400).json({
        success: false,
        message: "Order is not out for delivery",
      });
    }

    if (!order.deliveryOTP || !order.deliveryOTPExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP",
      });
    }

    // Check OTP expiry
    if (order.deliveryOTPExpiresAt < new Date()) {
      order.deliveryOTP = null;
      order.deliveryOTPExpiresAt = null;
      order.deliveryOTPAttempts = 0;

      await order.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Check maximum attempts
    if (order.deliveryOTPAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum attempts reached. Please request a new OTP",
      });
    }

    // Compare entered OTP with hashed OTP
    const isValidOTP = await bcrypt.compare(
      String(otp),
      order.deliveryOTP
    );

    if (!isValidOTP) {
      order.deliveryOTPAttempts += 1;

      if (order.deliveryOTPAttempts >= 3) {
        order.deliveryOTP = null;
        order.deliveryOTPExpiresAt = null;

        await order.save();

        return res.status(400).json({
          success: false,
          message: "Maximum attempts reached. Please request a new OTP",
        });
      }

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        remainingAttempts: 3 - order.deliveryOTPAttempts,
      });
    }

    // OTP correct: mark order as delivered
    order.deliveryStatus = "delivered";
    order.orderStatus = "delivered";
    order.deliveredAt = new Date();

    // Clear OTP data
    order.deliveryOTP = null;
    order.deliveryOTPExpiresAt = null;
    order.deliveryOTPAttempts = 0;

    await order.save();

    // Notify admin and customer after successful delivery
    const io = getIO();

    const orderData = {
      orderId: order._id,
      orderStatus: order.orderStatus,
      deliveryStatus: order.deliveryStatus,
      deliveryPartnerId: order.deliveryPartner,
      deliveredAt: order.deliveredAt,
      message: "Your order has been delivered successfully",
    };

    io.to("admin").emit("delivery-completed", orderData);

    io.to(`user_${order.user}`).emit(
      "delivery-completed",
      orderData
    );

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully",
      order: {
        orderId: order._id,
        deliveryStatus: order.deliveryStatus,
        orderStatus: order.orderStatus,
        deliveredAt: order.deliveredAt,
      },
    });
  } catch (error) {
    console.error("Verify delivery OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};


// 9. GET DELIVERY HISTORY
export const getDeliveryHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      deliveryStatus: "delivered",
    })
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ deliveredAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Delivery history fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get delivery history error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
