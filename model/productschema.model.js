import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        brand: {
            type: String
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        soldCount: {
            type: Number,
            default: 0
        },
        ratings: {
            type: Number,
            default: 0
        },
        reviewsCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
    },

    { timestamps: true }
);

productSchema.pre("save", async function () {
    if (!this.slug) {
        this.slug =
            this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    }
});


const Product = mongoose.model("Product", productSchema)
export default Product

