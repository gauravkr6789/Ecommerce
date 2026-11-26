import {
  Heart,
  Star,
  ShoppingCart,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAddcart } from "../../hooks/cart/useCart";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    mutateAsync: addToCart,
    isPending,
  } = useAddcart();

  const {
    _id,
    name,
    images,
    price,
    discountPrice,
    ratings,
    reviewsCount,
    stock,
  } = product;

  // =========================
  // ADD TO CART
  // =========================
  const handleAddtoCart = async () => {
    try {
      await addToCart({
        productId: _id,
        quantity: 1,
      });

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    }
  };

  // =========================
  // BUY NOW
  // =========================
  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    navigate("/checkout", {
      state: {
        source: "buyNow",
        productId: _id,
        quantity: 1,
      },
    });
  };

  const discount =
    discountPrice && price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const imageUrl = images?.[0]?.url
    ? images[0].url.startsWith("http")
      ? images[0].url
      : `${import.meta.env.VITE_API_URLL}${images[0].url}`
    : "";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">

      {/* Image Section */}
      <div className="relative overflow-hidden">

        <Link to={`/product/${_id}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
        >
          <Heart size={18} />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">

        <Link to={`/product/${_id}`}>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition">
            {name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm font-medium">
            {ratings?.toFixed(1) || "0.0"}
          </span>

          <span className="text-sm text-gray-500">
            ({reviewsCount || 0} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">

          <span className="text-2xl font-bold text-green-600">
            ₹{discountPrice || price}
          </span>

          {discountPrice && (
            <span className="text-gray-400 line-through">
              ₹{price}
            </span>
          )}

        </div>

        {/* Stock */}
        <p
          className={`mt-2 text-sm font-medium ${
            stock > 0
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">

          {/* Add To Cart */}
          <button
            onClick={handleAddtoCart}
            disabled={stock === 0 || isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
          >
            <ShoppingCart size={18} />

            {isPending
              ? "Adding..."
              : "Add To Cart"}
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={stock === 0}
            className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition disabled:bg-gray-400"
          >
            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;