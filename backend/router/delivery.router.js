import express from "express";

import {
  getAssignedOrders,
  markAsShipped,
  markAsDelivered,
} from "../controller/delivery.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";
import { isDelivery } from "../middleware/delivery.middleware.js";

const deliveryrouter =
  express.Router();

deliveryrouter.use(
  isAuthenticated,
  isDelivery
);

deliveryrouter.get(
  "/orders",
  getAssignedOrders
);

deliveryrouter.put(
  "/orders/:id/shipped",
  markAsShipped
);

deliveryrouter.put(
  "/orders/:id/delivered",
  markAsDelivered
);

export default deliveryrouter;