import razorpay from "../rozerpay/rozerPayConfig.js";
import Order from "../model/orderschema.model.js";
import crypto from 'crypto'
import { sendEmail } from "../services/email.services.js";


export const payOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items found", success: false });
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
    });

   
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created",
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};






export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing", success: false });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature", success: false });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) return res.status(404).json({ message: "Order not found", success: false });

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "paid";
    order.status = "confirmed";
    await order.save();

    res.status(200).json({ message: "Payment verified", success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found", success: false });

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (order.status === "delivered") {
      return res.status(400).json({ message: "Delivered order can't be cancelled", success: false });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


// Refund Order
export const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found", success: false });

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Only paid orders can be refunded", success: false });
    }

    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(order.totalPrice * 100),
    });

    order.paymentStatus = "refunded";
    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Refund successful", success: true, refund, order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const createPaymentLink = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.name || "Customer";

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required",
        success: false,
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      description: description || "Order Payment",
    };

    
    const response = await razorpay.paymentLink.create(options);
    const paymentLink = response.short_url;

   
    const htmlContent = `
      <div style="font-family:Arial;padding:20px">
        <h2>Hello ${userName},</h2>
        <p>Your payment of <strong>₹${amount}</strong> is pending.</p>
        <p>Please complete your payment using the button below:</p>
        
        <a href="${paymentLink}" 
           style="display:inline-block;
                  padding:12px 25px;
                  background:#3399cc;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:6px;
                  font-weight:bold;">
           Pay Now
        </a>

        <p style="margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>

        <p>Thank you,<br/>Your Store Team</p>
      </div>
    `;

  
    const emailResult = await sendEmail({
      to: userEmail,
      subject: "Complete Your Payment",
      html: htmlContent,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Payment link created but email failed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment link created & email sent successfully",
      link: paymentLink,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Payment link creation failed",
      error: error.message,
    });
  }
};