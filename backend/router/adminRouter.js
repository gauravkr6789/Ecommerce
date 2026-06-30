import express from 'express'

import isAuthenticated from '../middleware/authmiddleware.js'
import isAdmin from '../middleware/adminMiddleware.js'


import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getAllOrders,
  updateOrderStatus,
  getAllProductsAdmin,
  getMonthlySales,
  getTopProducts,assignDeliveryPartner
} from "../controller/admin.controller.js";



const Adminrouter =
  express.Router();

Adminrouter.use(
  isAuthenticated,
  isAdmin
);

Adminrouter.get(
  "/dashboard-stats",
  getDashboardStats
);

Adminrouter.get(
  "/users",
  getAllUsers
);

Adminrouter.put(
  "/users/:id/role",
  updateUserRole
);

Adminrouter.get(
  "/orders",
  getAllOrders
);

Adminrouter.put(
  "/orders/:id/status",
  updateOrderStatus
);

Adminrouter.get(
  "/products",
  getAllProductsAdmin
);

Adminrouter.get(
  "/monthly-sales",
  getMonthlySales
);

Adminrouter.get(
  "/top-products",
  getTopProducts
);

Adminrouter.put(
  "/assign-delivery",
  assignDeliveryPartner
);

export default Adminrouter

