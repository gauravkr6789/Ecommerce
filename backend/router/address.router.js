import express from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controller/address.controller.js";

import isAuthenticated from "../middleware/authmiddleware.js";

const Addressrouter =
  express.Router();

Addressrouter.use(isAuthenticated);

Addressrouter.post(
  "/",
  createAddress
);

Addressrouter.get(
  "/",
  getAddresses
);

Addressrouter.get(
  "/:id",
  getAddressById
);

Addressrouter.put(
  "/:id",
  updateAddress
);

Addressrouter.delete(
  "/:id",
  deleteAddress
);

export default Addressrouter;