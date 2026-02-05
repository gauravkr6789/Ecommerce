import razorpay from "../rozerpay/rozerPayConfig";
import Order from "razorpay/dist/types/orders.js";
import crypto from 'crypto'



export const payOrder = async (req, res,next) => {
    try {
        const { shippingAddress, items } = req.body;
        const userId = req.user._id;

        console.log("User ID:", userId);

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "no item found",
                success: false
            });
        }

        const totalPrice = items.reduce(
            (price, item) => price + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: userId,
            items,
            totalPrice,
            shippingAddress,
            paymentStatus: "pending",
        });

        const payOrder = await razorpay.orders.create({
            amount: Number(totalPrice) * 100, 
            currency: "INR",
            receipt: order._id.toString(),
        });

        return res.status(201).json({
            message: "order create successfull..",
            success: true,
            order,
            razorpayOrderId: payOrder.id,
            key: process.env.RAZORPAY_KEY_ID,
            amount: payOrder.amount,
            currency: payOrder.currency,
        });

    } catch (error) {
        console.error("Create order error :", error);
        return next(error)
    }
};






export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id; 

    //Required fields check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "All payment details are required",
        status: "fail",
        success: false
      });
    }

    //  Signature verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed. Invalid signature.",
        status: "fail",
        success: false
      });
    }

    
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this order",
        status: "fail",
        success: false
      });
    }

    // Update order payment status
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "paid";
    order.status = "confirmed";
    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      status: "success",
      success: true,
      order
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false
    });
  }
};



export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id; 

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this order",
        status: "fail",
        success: false
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled",
        status: "fail",
        success: false
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
        status: "fail",
        success: false
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      status: "success",
      success: true,
      order
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false
    });
  }
};


// Refund Order
export const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    // Check ownership
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this order",
        status: "fail",
        success: false
      });
    }

    // Check if paid
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Cannot refund unpaid order",
        status: "fail",
        success: false
      });
    }

    // Initiate refund via Razorpay
    const refund = await Razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(order.totalPrice * 100) // amount in paise
    });

    // Update order
    order.status = "cancelled";
    order.paymentStatus = "refunded";
    await order.save();

    return res.status(200).json({
      message: "Order refunded successfully",
      status: "success",
      success: true,
      order,
      refund
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false
    });
  }
};

