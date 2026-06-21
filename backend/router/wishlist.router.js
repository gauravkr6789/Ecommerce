import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";

const wishlistrouter =
  express.Router();

wishlistrouter.post(
  "/add",
  protect,
  addToWishlist
);

wishlistrouter.get(
  "/",
  protect,
  getWishlist
);

wishlistrouter.delete(
  "/remove/:productId",
  protect,
  removeFromWishlist
);

wishlistrouter.delete(
  "/clear",
  protect,
  clearWishlist
);

export default wishlistrouter;