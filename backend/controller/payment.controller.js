import razorpay from "../rozerpay/rozerPayConfig.js";
import Order from "../model/orderschema.model.js";
import crypto from "crypto";


export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;

    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
        data: null,
      });
    }

    const totalAmount = items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      data: null,
    });
  }
};




export const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
        data: null,
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: null,
      });
    }

    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (
      order.razorpayOrderId !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Order mismatch detected",
        data: null,
      });
    }

    order.paymentStatus = "paid";

    order.orderStatus = "processing";

    order.razorpayPaymentId =
      razorpay_payment_id;

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
      data: {
        orderId: order._id,
        paymentStatus:
          order.paymentStatus,
        orderStatus:
          order.orderStatus,
      },
    });
  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify payment",
      data: null,
    });
  }
};
// ✅ Refund Order
export const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to refund this order",
        data: null,
      });
    }

    if (order.paymentStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Order is already refunded",
        data: null,
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be refunded",
        data: null,
      });
    }

    if (!order.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment reference not found",
        data: null,
      });
    }

    const refund = await razorpay.payments.refund(
      order.razorpayPaymentId,
      {
        amount: Math.round(order.totalAmount * 100),
      }
    );

    order.paymentStatus = "refunded";
    order.orderStatus = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refund,
        order,
      },
    });
  } catch (error) {
    console.error("Refund Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process refund",
      data: null,
    });
  }
};

export const cancelOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const userId =
      req.user._id;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
        data: null,
      });
    }

    if (
      order.user.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to cancel this order",
        data: null,
      });
    }

    if (
      order.orderStatus ===
      "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Delivered order cannot be cancelled",
        data: null,
      });
    }

    if (
      order.orderStatus ===
      "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order is already cancelled",
        data: null,
      });
    }

    order.orderStatus =
      "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "Cancel Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel order",
      data: null,
    });
  }
};

