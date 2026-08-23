import Cart from "../model/cartSchema.js";
import Product from "../model/productschema.model.js";
import mongoose from "mongoose";

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price discountPrice images stock isActive",
    );

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        status: "success",
        success: true,
        cart: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      status: "success",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Add product to cart
export const AddToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        success: false,
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available`,
        status: "fail",
        success: false,
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available`,
          status: "fail",
          success: false,
        });
      }

      existingItem.quantity = newQuantity;

      // Display snapshot only
      existingItem.price =
        product.discountPrice > 0 ? product.discountPrice : product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price:
          product.discountPrice > 0 ? product.discountPrice : product.price,
      });
    }

    await cart.save();

    await cart.populate(
      "items.product",
      "name price discountPrice images stock isActive",
    );

    return res.status(200).json({
      message: "Product added to cart",
      status: "success",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        success: false,
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available`,
        status: "fail",
        success: false,
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        status: "fail",
        success: false,
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
        status: "fail",
        success: false,
      });
    }

    item.quantity = quantity;

    // Update display price
    item.price =
      product.discountPrice > 0 ? product.discountPrice : product.price;

    await cart.save();

    await cart.populate(
      "items.product",
      "name price discountPrice images stock isActive",
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      status: "success",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Remove product from cart
export const removeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        status: "fail",
        success: false,
      });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        message: "Product not found in cart",
        status: "fail",
        success: false,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart",
      status: "success",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        status: "fail",
        success: false,
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      status: "success",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};
