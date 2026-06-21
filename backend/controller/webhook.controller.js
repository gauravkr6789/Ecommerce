import razorpay from "../rozerpay/rozerPayConfig.js";
import Order from "../model/orderschema.model.js";

export const razorpayWebhook = async (
  req,
  res
) => {
  try {
    const receivedSignature =
      req.headers[
        "x-razorpay-signature"
      ];

    if (!receivedSignature) {
      return res.status(400).json({
        success: false,
        message: "Webhook signature missing",
        data: null,
      });
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_WEBHOOK_SECRET
        )
        .update(req.body)
        .digest("hex");

    if (
      expectedSignature !==
      receivedSignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
        data: null,
      });
    }

    const event = JSON.parse(
      req.body.toString()
    );

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(
          event
        );
        break;

      case "payment.failed":
        await handlePaymentFailed(
          event
        );
        break;

      case "refund.processed":
        await handleRefundProcessed(
          event
        );
        break;

      default:
        console.log(
          `Unhandled Event: ${event.event}`
        );
    }

    return res.status(200).json({
      success: true,
      message:
        "Webhook processed successfully",
      data: null,
    });
  } catch (error) {
    console.error(
      "Webhook Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to process webhook",
      data: null,
    });
  }
};

const handlePaymentCaptured =
async (event) => {
  const payment =
    event.payload.payment.entity;

  const order =
    await Order.findOne({
      razorpayOrderId:
        payment.order_id,
    });

  if (!order) {
    console.log(
      "Order not found for payment"
    );
    return;
  }

  order.paymentStatus = "paid";

  order.orderStatus =
    "processing";

  order.razorpayPaymentId =
    payment.id;

  await order.save();

  console.log(
    `Payment captured for order ${order._id}`
  );
};

const handlePaymentFailed =
async (event) => {
  const payment =
    event.payload.payment.entity;

  const order =
    await Order.findOne({
      razorpayOrderId:
        payment.order_id,
    });

  if (!order) {
    console.log(
      "Order not found for failed payment"
    );
    return;
  }

  order.paymentStatus =
    "failed";

  await order.save();

  console.log(
    `Payment failed for order ${order._id}`
  );
};

const handleRefundProcessed =
async (event) => {
  const refund =
    event.payload.refund.entity;

  const order =
    await Order.findOne({
      razorpayPaymentId:
        refund.payment_id,
    });

  if (!order) {
    console.log(
      "Order not found for refund"
    );
    return;
  }

  order.paymentStatus =
    "refunded";

  order.orderStatus =
    "cancelled";

  await order.save();

  console.log(
    `Refund processed for order ${order._id}`
  );
};