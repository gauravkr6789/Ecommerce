import express from 'express'
import isAuthenticated from '../middleware/authmiddleware.js'
import isAdmin from '../middleware/adminMiddleware.js'
import { isDelivery } from '../middleware/delivery.middleware.js'

import {
  adminDeliveryPartner,
  getAssignedOrders,
  acceptDeliveryAssignment,
  rejectDeliveryAssignment,
  markAsPickedUp,
  markOutForDelivery,
  sendDeliveryOTP,
  verifyDeliveryOTP,
  getDeliveryHistory,
} from "../controller/delivery.controller.js"
const deliveryRouter = express.Router();

// All routes
deliveryRouter.post("/assign", isAuthenticated, isAdmin, adminDeliveryPartner);
deliveryRouter.get("/assigned-orders", isAuthenticated, isDelivery, getAssignedOrders);
deliveryRouter.patch("/accept/:orderId", isAuthenticated, isDelivery, acceptDeliveryAssignment);
deliveryRouter.patch("/reject/:orderId", isAuthenticated, isDelivery, rejectDeliveryAssignment);
deliveryRouter.patch("/picked-up/:orderId", isAuthenticated, isDelivery, markAsPickedUp);
deliveryRouter.patch("/out-for-delivery/:orderId", isAuthenticated, isDelivery, markOutForDelivery);
deliveryRouter.post("/send-otp/:id", isAuthenticated, isDelivery, sendDeliveryOTP);
deliveryRouter.post("/verify-otp/:id", isAuthenticated, isDelivery, verifyDeliveryOTP);
deliveryRouter.get("/history", isAuthenticated, isDelivery, getDeliveryHistory);

export default deliveryRouter;
