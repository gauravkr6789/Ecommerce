import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        // Product name snapshot at purchase time
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // Actual price per unit at purchase time
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        // price × quantity
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Shipping address snapshot at order time
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    couponCode: {
      type: String,
      default: null,
      trim: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Overall order status
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "delivered"],
      default: "pending",
    },

    // Assigned delivery partner
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Delivery progress
    deliveryStatus: {
      type: String,
      enum: [
        "unassigned",
        "assigned",
        "accepted",
        "rejected",
        "picked-up",
        "out-for-delivery",
        "delivered",
      ],
      default: "unassigned",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    deliveryOTP: {
      type: String,
      default: null,
    },
    deliveryOTPExpiresAt: {
      type: Date,
      default: null,
    },
    deliveryOTPAttempts: {
      type: Number,
      default: 0,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// User ke latest orders efficiently fetch karne ke liye
orderSchema.index({ user: 1, createdAt: -1 });

// Delivery partner ke assigned orders efficiently fetch karne ke liye
orderSchema.index({ deliveryPartner: 1, deliveryStatus: 1 });

export default mongoose.model("Order", orderSchema);
