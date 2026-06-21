import Order from "../model/orderschema.model.js";




export const getAssignedOrders =
async (req, res) => {
  try {

    const orders =
      await Order.find({
        deliveryPartner:
          req.user._id,

        orderStatus: {
          $in: [
            "processing",
            "shipped"
          ]
        }
      })
      .populate(
        "user",
        "username email phone"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      message:
        "Assigned orders fetched successfully",
      data: orders,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Mark Order Shipped

export const markAsShipped =
async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message:
          "Order not found",
        data: null,
      });

    }

    order.orderStatus =
      "shipped";

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order marked as shipped",
      data: order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};


// Mark Delivered

export const markAsDelivered =
async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message:
          "Order not found",
        data: null,
      });

    }

    order.orderStatus =
      "delivered";

    order.deliveredAt =
      new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order delivered successfully",
      data: order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });

  }
};