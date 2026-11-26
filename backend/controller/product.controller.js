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
      category,
      brand,
      stock,
    } = req.body;

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const imageList = uploadedFiles.map((file) => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename,
    }));

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Required product fields are missing",
        status: "fail",
        success: false,
      });
    }

    if (!imageList.length) {
      return res.status(400).json({
        message: "At least one product image is required",
        status: "fail",
        success: false,
      });
    }

    const parsedPrice = Number(price);
    const parsedDiscountPrice =
      discountPrice === undefined || discountPrice === ""
        ? 0
        : Number(discountPrice);
    const parsedStock = Number(stock);

    if (parsedPrice < 0 || parsedStock < 0 || parsedDiscountPrice < 0) {
      return res.status(400).json({
        message: "Price and stock cannot be negative",
        status: "fail",
        success: false,
      });
    }

    if (parsedDiscountPrice && parsedDiscountPrice >= parsedPrice) {
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

    const normalizedSlug =
      (slug && String(slug).trim()) ||
      String(name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const product = await Product.create({
      name,
      slug: normalizedSlug,
      description,
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      images: imageList,
      category,
      brand,
      stock: parsedStock,
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
      "category",
      "brand",
      "stock",
      "isActive",
    ];

    const updates = {};

    // =========================
    // Normal product fields
    // =========================

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // =========================
    // Validate price
    // =========================

    if (updates.price !== undefined && Number(updates.price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
        status: "fail",
        success: false,
      });
    }

    // =========================
    // Validate stock
    // =========================

    if (updates.stock !== undefined && Number(updates.stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
        status: "fail",
        success: false,
      });
    }

    // =========================
    // Existing images
    // =========================

    let existingImages = [];

    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid existingImages format",
          status: "fail",
          success: false,
        });
      }
    }

    // =========================
    // New uploaded images
    // =========================

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];

    const newImages = uploadedFiles.map((file) => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename,
    }));

    // =========================
    // Final images
    // =========================

    const finalImages = [...existingImages, ...newImages];

    // Only update images if image data was sent
    if (req.body.existingImages !== undefined || uploadedFiles.length > 0) {
      updates.images = finalImages;
    }

    // =========================
    // Update product
    // =========================

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
    console.error("UPDATE PRODUCT ERROR:", error);

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
