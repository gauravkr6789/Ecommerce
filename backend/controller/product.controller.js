import Product from '../model/productschema.model.js';
import Category from '../model/categoryschema.model.js'
import slugify from "slugify";



export const addProduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock
    } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        message: "All required fields are mandatory",
        success: false
      });
    }

    // Find category by NAME
    let categoryDoc = await Category.findOne({
      name: category
    });

    // Create category if not exists
    if (!categoryDoc) {

      categoryDoc = await Category.create({
        name: category,
        slug: slugify(category, { lower: true }),
        parent: null
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {

      images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));
    }

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      price,
      discountPrice,
      category: categoryDoc._id,
      brand,
      stock,
      images,
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: product
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
};



export const getAllProduct = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 12, 1);
    const skip = (page - 1) * limit;

    const {
      search = "",
      category = "",
      minPrice,
      maxPrice,
      sort = "newest",
      inStock,
    } = req.query;

    let filter = {
      isActive: true,
    };

    // ===== Search =====
    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ===== Category =====
    if (category) {
      let categoryDoc = null;

      // Try by ObjectId
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryDoc = await Category.findById(category);
      }

      // Try by slug
      if (!categoryDoc) {
        categoryDoc = await Category.findOne({
          slug: category,
        });
      }

      // Try by name
      if (!categoryDoc) {
        categoryDoc = await Category.findOne({
          name: {
            $regex: `^${category}$`,
            $options: "i",
          },
        });
      }

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // ===== Price Filter =====
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // ===== Stock =====
    if (inStock === "true") {
      filter.stock = {
        $gt: 0,
      };
    }

    // ===== Sorting =====
    const sortOptions = {
      newest: {
        createdAt: -1,
      },
      oldest: {
        createdAt: 1,
      },
      price_asc: {
        price: 1,
      },
      price_desc: {
        price: -1,
      },
      rating: {
        rating: -1,
      },
      stock: {
        stock: -1,
      },
      name_asc: {
        name: 1,
      },
      name_desc: {
        name: -1,
      },
    };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      statusCode: 200,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasNextPage: page < Math.ceil(totalProducts / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      statusCode: 500,
      data: null,
      error: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        statusCode: 404,
        data: {}
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      statusCode: 200,
      data: product
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
      success: false,
      statusCode: 500,
      data: {}
    });

  }
};




export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        statusCode: 404,
        data: {}
      });
    }

    if (req.body?.name) {
      product.name = req.body.name;
      product.slug = slugify(req.body.name, { lower: true });
    }

    if (req.body?.description) product.description = req.body.description;
    if (req.body?.price) product.price = Number(req.body.price);
    if (req.body?.discountPrice) product.discountPrice = Number(req.body.discountPrice);
    if (req.body?.brand) product.brand = req.body.brand;
    if (req.body?.stock) product.stock = Number(req.body.stock);

    if (req.body?.category) {

      const categoryDoc = await Category.findById(req.body.category);

      if (!categoryDoc) {
        return res.status(404).json({
          message: "Category not found",
          success: false,
          statusCode: 404,
          data: {}
        });
      }

      product.category = categoryDoc._id;
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      statusCode: 200,
      data: product
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
      success: false,
      statusCode: 500,
      data: {}
    });

  }
};




export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        statusCode: 404,
        data: {}
      });
    }

    product.isActive = false;

    await product.save();

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      statusCode: 200,
      data: {}
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
      success: false,
      statusCode: 500,
      data: {}
    });

  }
};




export const restockProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        statusCode: 404,
        data: {}
      });
    }

    const quantity = Number(req.body.addQuantity) || 0;

    product.stock += quantity;

    await product.save();

    return res.status(200).json({
      message: "Stock increased successfully",
      success: true,
      statusCode: 200,
      data: product
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
      success: false,
      statusCode: 500,
      data: {}
    });

  }
};
