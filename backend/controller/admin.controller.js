import User from "../model/UserSchema.model.js";
import Product from "../model/productschema.model.js";
import Order from "../model/orderschema.model.js";


export const getDashboardStats =
async (req, res) => {
  try {

    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]
        ?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      message:
        "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


// Get All Users
export const getAllUsers =
async (req, res) => {
  try {

    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      message:
        "Users fetched successfully",
      data: users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


// Update User Role
export const updateUserRole =
async (req, res) => {
  try {

    const { role } =
      req.body;

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
        data: null,
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Role updated successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


// Get All Orders
export const getAllOrders =
async (req, res) => {
  try {

    const orders =
      await Order.find()
        .populate(
          "user",
          "username email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      message:
        "Orders fetched successfully",
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


// Update Order Status
export const updateOrderStatus =
async (req, res) => {
  try {

    const {
      orderStatus,
    } = req.body;

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
      orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
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


// Get All Products
export const getAllProductsAdmin =
async (req, res) => {
  try {

    const products =
      await Product.find()
        .populate(
          "category",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      message:
        "Products fetched successfully",
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


// Monthly Sales
export const getMonthlySales =
async (req, res) => {
  try {

    const sales =
      await Order.aggregate([
        {
          $match: {
            paymentStatus:
              "paid",
          },
        },
        {
          $group: {
            _id: {
              month: {
                $month:
                  "$createdAt",
              },
            },

            revenue: {
              $sum:
                "$totalAmount",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,
      message:
        "Monthly sales fetched successfully",
      data: sales,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


// Top Products
export const getTopProducts =
async (req, res) => {
  try {

    const products =
      await Product.find()
        .sort({
          soldCount: -1,
        })
        .limit(10);

    return res.status(200).json({
      success: true,
      message:
        "Top products fetched successfully",
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const assignDeliveryPartner =
async (req, res) => {

  try {

    const {
      orderId,
      deliveryPartnerId,
    } = req.body;

    const order =
      await Order.findByIdAndUpdate(
        orderId,
        {
          deliveryPartner:
            deliveryPartnerId,

          orderStatus:
            "processing",
        },
        {
          new: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Delivery partner assigned successfully",
      data: order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
      data: null,
    });

  }
};