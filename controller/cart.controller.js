import Product from "../model/productschema.model";
import Cart from '../model/cartSchema.js'

export const AddToCart = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const { ProductId, quantity } = req.body

        const product = await Product.findById(ProductId)
        //  check product existance
        if (!product) {
            return res.status(404).json({
                message: "product not exist",
                success: false,
                status: 404
            })
        }
        // check stock 

        if (product.stock < quantity) {
            res.status(404).json({
                message: "not enough stock available",
                success: false,
                status: 404
            })
        }
        // find cart
        let cart = await Cart.findOne({ userId })

        // check cart
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 })
        }
        // find item index if availabe return index otherwise -1
        const itemIndex = cart.items.findIndex((item) => {
            item.product.toString() === ProductId
        })
        // index > -1 means item found just we need to update the quantity of product
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        }
        // if index is -1 then we need to create new cart
        else {
            cart.items.push({
                product: ProductId,
                quantity,
                price: product.discountPrice > 0 ? product.discountPrice : product.price
            })
        }

        // calculate the totalprice of item

        cart.totalPrice = cart.items.reduce((totalprice, item) => {
            totalprice += item.price * item.quantity, 0
        })
        // save cart
        await cart.save();

        return res.status(201).json({
            message: "product add to cart successfull",
            success: true,
            status: 201,
            cart
        })


    }
    catch (err) {
        return next(err)
    }
}


export const getUserCart = async (req, res, next) => {
    try {

        const cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({
                message: "cart is empty",
                success: false,
                status: 404
            })
        }

        return res.status(200).json({
            message: "getting cart successfull",
            status: true,
            status: 200,
            cart
        })

    }
    catch (err) {
        return next(err)
    }
}


export const updateCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body

        const cart = await Cart.findOne({ user: req.use._id })

        if (!cart) {
            return res.status(404).json({
                message: "cart not found ",
                status: false,
                status: 404
            })
        }

        const item = cart.items.find((item) => {
            item.product.toString() === productId
        })

        if (!item) {
            return res.status(404).json({
                message: "item not found",
                success: false,
                status: 404
            })
        }

        item.quantity = quantity

        cart.totalPrice = cart.items.reduce((total, item) => {
            total += item.price * item.quantity, 0
        },)

        await cart.save()
        return res.status(200).json({
            message: "cart update successfull",
            success: true,
            status: 200
        })


    }
    catch (err) {
        res.status(500).json({
            message: "update cart error",
            success: false,
            status: 500
        })
        return next(err)
    }
}

export const removeCart = async (req, res, next) => {
    try {

        const { productId } = req.params

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({
                message: "cart not found ",
                status: false,
                status: 404
            })
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        )

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save()

        return res.status(200).json({
            message: "item remove  successfull",
            success: true,
            status: 200
        })


    }
    catch (err) {
        return next(err)
    }
}

export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        return res.status(200).json({
            message: "Cart cleared",
            success: true,
            status: 200
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};