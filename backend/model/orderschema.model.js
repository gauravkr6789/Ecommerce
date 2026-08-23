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

    // Snapshot of coupon code used in this order
    couponCode: {
      type: String,
      default: null,
      trim: true,
    },

    // Discount received from coupon
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total of all order items before discount
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Final amount customer has to pay
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// User ke latest orders efficiently fetch karne ke liye
orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);