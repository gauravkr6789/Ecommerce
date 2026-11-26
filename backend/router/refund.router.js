
import express from "express";

import {
  createRefundPayment,
  getMyRefunds,
  approveRefund,
  getAllRefunds,
  rejectRefund,
} from "../controller/refund.cotroller.js"

import isAuthenticated from "../middleware/authmiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const refundRouter = express.Router();

// USER: Create refund request
refundRouter.post(
  "/request/:orderId",
  isAuthenticated,
  createRefundPayment
);

// USER: Get own refund history
refundRouter.get(
  "/my-refunds",
  isAuthenticated,
  getMyRefunds
);

// ADMIN: Approve refund
refundRouter.patch(
  "/approve/:refundId",
  isAuthenticated,
  isAdmin,
  approveRefund
);

// ADMIN: Get all refunds
refundRouter.get(
  "/all-refunds",
  isAuthenticated,
  isAdmin,
  getAllRefunds
);

// ADMIN: Reject refund
refundRouter.patch(
  "/reject/:refundId",
  isAuthenticated,
  isAdmin,
  rejectRefund
);

export default refundRouter;
