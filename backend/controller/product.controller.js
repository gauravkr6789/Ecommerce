import mongoose from "mongoose";
import Category from "../model/categoryschema.model.js";
import Product from "../model/productschema.model.js";

// Create product - Admin
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Required product fields are missing",
        status: "fail",
        success: false,
      });
    }

    if (price < 0 || stock < 0 || discountPrice < 0) {
      return res.status(400).json({
        message: "Price and stock cannot be negative",
        status: "fail",
        success: false,
      });
    }

    if (discountPrice && discountPrice >= price) {
      return res.status(400).json({
        message: "Discount price must be lower than original price",
        status: "fail",
        success: false,
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category ID",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice: discountPrice || 0,
      images,
      category,
      brand,
      stock,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      status: "success",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Get all active products
export const getAllProduct = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;

    const filter = {
      isActive: true,
    };

    if (req.query.category) {
      if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
        return res.status(400).json({
          message: "Invalid category ID",
          status: "fail",
          success: false,
        });
      }

      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      message: "Products fetched successfully",
      status: "success",
      success: true,

      products,

      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      status: "success",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Update product - Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    const allowedFields = [
      "name",
      "slug",
      "description",
      "price",
      "discountPrice",
      "images",
      "category",
      "brand",
      "stock",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.price !== undefined && updates.price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
        status: "fail",
        success: false,
      });
    }

    if (updates.stock !== undefined && updates.stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      status: "success",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};

// Soft delete product - Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        status: "fail",
        success: false,
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      status: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      success: false,
    });
  }
};
