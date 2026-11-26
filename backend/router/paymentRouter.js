import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/payment.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", isAuthenticated, createPaymentOrder);

paymentRouter.post("/verify-payment", isAuthenticated, verifyPayment);

export default paymentRouter;
