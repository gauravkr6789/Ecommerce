import express from "express";

import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controller/review.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";

const Reviewrouter =
  express.Router();

Reviewrouter.post(
  "/",
  isAuthenticated,
  createReview
);

Reviewrouter.get(
  "/:productId",
  getProductReviews
);

Reviewrouter.delete(
  "/:id",
  protect,
  deleteReview
);

export default Reviewrouter;