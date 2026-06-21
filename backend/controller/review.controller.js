import Review from "../model/reviewSchema.js";
import Product from "../model/productschema.model.js";

const updateProductRating = async (
  productId
) => {

  const reviews =
    await Review.find({
      product: productId,
    });

  const reviewsCount =
    reviews.length;

  const ratings =
    reviewsCount === 0
      ? 0
      : (
          reviews.reduce(
            (acc, review) =>
              acc + review.rating,
            0
          ) / reviewsCount
        ).toFixed(1);

  await Product.findByIdAndUpdate(
    productId,
    {
      ratings: Number(ratings),
      reviewsCount,
    }
  );
};



// Create Review

export const createReview =
  async (req, res) => {
    try {

      const {
        productId,
        rating,
        comment,
      } = req.body;

      const existingReview =
        await Review.findOne({
          user: req.user._id,
          product: productId,
        });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message:
            "You already reviewed this product",
          data: null,
        });
      }

      const review =
        await Review.create({
          user: req.user._id,
          product: productId,
          rating,
          comment,
        });

      await updateProductRating(
        productId
      );

      return res.status(201).json({
        success: true,
        message:
          "Review added successfully",
        data: review,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };



// Get Product Reviews

export const getProductReviews =
  async (req, res) => {
    try {

      const reviews =
        await Review.find({
          product:
            req.params.productId,
        })
          .populate(
            "user",
            "username avatar"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        message:
          "Reviews fetched successfully",
        data: reviews,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };



// Delete Review

export const deleteReview =
  async (req, res) => {
    try {

      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
          data: null,
        });
      }

      const isOwner =
        review.user.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role === "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
          data: null,
        });
      }

      const productId =
        review.product;

      await review.deleteOne();

      await updateProductRating(
        productId
      );

      return res.status(200).json({
        success: true,
        message:
          "Review deleted successfully",
        data: null,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });

    }
  };