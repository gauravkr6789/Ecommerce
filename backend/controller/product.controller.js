import Product from '../model/productschema.model.js';
import Category from "../model/category.schema.model.js";
import slugify from "slugify";


export const addProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, brand, stock, parentCategory } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        message: "All required fields are mandatory",
        success: false,
        statusCode: 400,
        data: {}
      });
    }

    let categoryDoc = await Category.findOne({ name: category.trim() });
    if (!categoryDoc) {
      categoryDoc = await Category.create({
        name: category.trim(),
        slug: slugify(category.trim(), { lower: true }),
        parentCategory: parentCategory || null
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
      statusCode: 201,
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




export const getAllProduct = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;


    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 0;
    const sort = req.query.sort || "newest";
    const inStockOnly = req.query.inStock === "true";


    let filter = {
      isActive: true
    };


    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }


    if (category) {
      filter.category = category;
    }


    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }


    if (inStockOnly) {
      filter.stock = { $gt: 0 };
    }


    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 }
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };


    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);


    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);


    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");

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

    if (req.body?.name) product.name = req.body.name;
    if (req.body?.description) product.description = req.body.description;
    if (req.body?.price) product.price = Number(req.body.price);
    if (req.body?.discountPrice) product.discountPrice = Number(req.body.discountPrice);
    if (req.body?.brand) product.brand = req.body.brand;
    if (req.body?.stock) product.stock = Number(req.body.stock);

    if (req.body?.category) {
      let categoryDoc = await Category.findOne({ name: req.body.category.trim() });
      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: req.body.category.trim(),
          slug: slugify(req.body.category.trim(), { lower: true })
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

    product.stock += req.body.addQuantity || 0;
    await product.save();

    return res.status(200).json({
      message: "Stock increased successfully",
      success: true,
      statusCode: 200,
      data: product
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
      statusCode: 500,
      data: {}
    });
  }
};
