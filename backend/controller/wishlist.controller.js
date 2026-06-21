import Wishlist from "../model/wishlist.model.js";



export const addToWishlist =
  async (req, res) => {
    try {

      const { productId } =
        req.body;

      let wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {

        wishlist =
          await Wishlist.create({
            user: req.user._id,
            products: [productId],
          });

      } else {

        const alreadyExists =
          wishlist.products.some(
            (item) =>
              item.toString() ===
              productId
          );

        if (alreadyExists) {
          return res.status(409).json({
            success: false,
            message:
              "Product already in wishlist",
            data: null,
          });
        }

        wishlist.products.push(
          productId
        );

        await wishlist.save();
      }

      return res.status(200).json({
        success: true,
        message:
          "Product added to wishlist",
        data: wishlist,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };



// Get Wishlist

export const getWishlist =
  async (req, res) => {
    try {

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        }).populate({
          path: "products",
          populate: {
            path: "category",
            select: "name",
          },
        });

      return res.status(200).json({
        success: true,
        message:
          "Wishlist fetched successfully",
        data:
          wishlist?.products || [],
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };



// Remove Product

export const removeFromWishlist =
  async (req, res) => {
    try {

      const { productId } =
        req.params;

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {

        return res.status(404).json({
          success: false,
          message:
            "Wishlist not found",
          data: null,
        });

      }

      wishlist.products =
        wishlist.products.filter(
          (item) =>
            item.toString() !==
            productId
        );

      await wishlist.save();

      return res.status(200).json({
        success: true,
        message:
          "Product removed from wishlist",
        data: wishlist,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };



// Clear Wishlist

export const clearWishlist =
  async (req, res) => {
    try {

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {

        return res.status(404).json({
          success: false,
          message:
            "Wishlist not found",
          data: null,
        });

      }

      wishlist.products = [];

      await wishlist.save();

      return res.status(200).json({
        success: true,
        message:
          "Wishlist cleared successfully",
        data: wishlist,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };