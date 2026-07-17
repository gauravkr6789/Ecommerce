import Category from "../model/categoryschema.model.js";
import slugify from "slugify";

// =========================
// Add Category
// =========================
export const addCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const alreadyExists = await Category.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      parent: parent || null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Get All Categories
// =========================
export const getAllCategory = async (req, res) => {
  try {

    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      total: categories.length,
      data: categories,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Get Category By Id
// =========================
export const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id)
      .populate("parent", "name slug");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Update Category
// =========================
export const updateCategory = async (req, res) => {
  try {

    const { name, parent } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name) {
      category.name = name;

      category.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }

    if (parent !== undefined) {
      category.parent = parent || null;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Delete Category
// =========================
export const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};