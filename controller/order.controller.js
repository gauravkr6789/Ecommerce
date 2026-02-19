import Order from "../model/orderschema.model.js";
import mongoose from "mongoose";

// 🔹 Create Order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items, totalPrice } = req.body;
    const userId = req.user._id; // Auth middleware se

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items in order",
        status: "fail",
        success: false
      });
    }

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentStatus: "pending",
      status: "pending"
    });

    return res.status(201).json({
      message: "Order created successfully",
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

// 🔹 Get Orders of Logged-in User
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalOrders / limit);
    return res.status(200).json({
      message: "User orders fetched successfully",
      status: "success",
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false
    });
  }
};


// 🔹 Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
        status: "fail",
        success: false
      });
    }

    const order = await Order.findById(id)
      .populate("items.product", "name price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    if (order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
        status: "fail",
        success: false
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
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

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
        status: "fail",
        success: false
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
        status: "fail",
        success: false
      });
    }

    Object.assign(order, updates);
    await order.save();

    return res.status(200).json({
      message: "Order updated successfully",
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


export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
        status: "fail",
        success: false
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        success: false
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
        status: "fail",
        success: false
      });
    }

    await order.remove();

    return res.status(200).json({
      message: "Order deleted successfully",
      status: "success",
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false
    });
  }
};
