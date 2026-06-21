import Category from '../model/categoryschema.model.js'

export const createCategory = async (req, res) => {
    try {

        const { name, parent } = req.body;

        const category = await Category.create({
            name,
            parent: parent || null
        });

        return res.status(201).json({
            message: "Category created successfully",
            success: true,
            data: category
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
            success: false
        });

    }
}

export const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();

        if (category.length === 0) {
            return res.status(400).json({
                message: "category empty",
                status: 400,
                success: false
            });
        }

        return res.status(200).json({
            message: "fetch category successful",
            status: 200,
            success: true,
            categories: category
        });

    } catch (err) {
        return res.status(500).json({
            message: "fetching category error",
            status: 500,
            success: false,
            error: err.message
        });
    }
};

export const getSingleCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "category not found",
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: "fetch category successful",
            status: 200,
            success: true,
            category: category
        });

    }
    catch (err) {

        return res.status(500).json({
            message: "fetch category error",
            status: 500,
            success: false,
            error: err.message
        });

    }
};

export const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, parent } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            {
                name: name,
                parent: parent || null
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                message: "category not found",
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: "category updated successful",
            status: 200,
            success: true,
            category: category
        });

    }
    catch (err) {

        return res.status(500).json({
            message: "update category error",
            status: 500,
            success: false,
            error: err.message
        });

    }
};

export const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                message: "category not found",
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: "category deleted successful",
            status: 200,
            success: true
        });

    }
    catch (err) {

        return res.status(500).json({
            message: "delete category error",
            status: 500,
            success: false,
            error: err.message
        });

    }
};