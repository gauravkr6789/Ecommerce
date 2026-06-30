import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controller/wishlist.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";

const wishlistrouter =
  express.Router();

wishlistrouter.post(
  "/add",
  isAuthenticated,
  addToWishlist
);

wishlistrouter.get(
  "/",
  isAuthenticated,
  getWishlist
);

wishlistrouter.delete(
  "/remove/:productId",
  isAuthenticated,
  removeFromWishlist
);

wishlistrouter.delete(
  "/clear",
  isAuthenticated,
  clearWishlist
);

export default wishlistrouter;