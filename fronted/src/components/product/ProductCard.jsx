import { Heart, Star, ShoppingCart, ArrowUpRight, Package } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAddcart } from "../../hooks/cart/useCart";
import useWishlist from "../../hooks/wishlist/useWishlist";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { mutateAsync: addToCart, isPending } = useAddcart();
  const { addWishlist, wishlist } = useWishlist();

  const {
    _id,
    name,
    images,
    price,
    discountPrice,
    ratings,
    reviewsCount,
    stock,
    category,
  } = product;

  const isWishlisted = wishlist.some((item) => item._id === _id);

  // ADD TO WISHLIST
  const handleWishlist = () => {
    if (isWishlisted) {
      toast.info("Product already in wishlist");
      return;
    }

    addWishlist(_id, {
      onSuccess: () => {
        toast.success("Product added to wishlist");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to add product");
      },
    });
  };

  // ADD TO CART
  const handleAddtoCart = async () => {
    try {
      await addToCart({
        productId: _id,
        quantity: 1,
      });

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    }
  };

  // BUY NOW
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
    discountPrice > 0 && price > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const finalPrice = discountPrice > 0 ? discountPrice : price;

  // IMAGE URL
  const imageUrl = images?.[0]?.url
    ? images[0].url.startsWith("http")
      ? images[0].url
      : `${import.meta.env.VITE_API_URLL}${images[0].url}`
    : "";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/60 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800 dark:hover:shadow-indigo-950/30">
      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50/70 dark:from-gray-800 dark:to-gray-900">
        <Link to={`/product/${_id}`} className="block">
          <div className="flex h-64 items-center justify-center overflow-hidden p-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <Package size={65} className="text-gray-300 dark:text-gray-600" />
            )}
          </div>
        </Link>

        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* WISHLIST */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? "Already in Wishlist" : "Add to Wishlist"}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white dark:bg-gray-800/90 dark:text-gray-300"
        >
          <Heart
            size={19}
            className={
              isWishlisted ? "fill-red-500 text-red-500" : "transition-colors"
            }
          />
        </button>

        {/* STOCK BADGE */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
              stock > 0
                ? "bg-green-100/90 text-green-700 dark:bg-green-950/90 dark:text-green-400"
                : "bg-red-100/90 text-red-600 dark:bg-red-950/90 dark:text-red-400"
            }`}
          >
            {stock > 0 ? "● In Stock" : "● Out of Stock"}
          </span>
        </div>

        {/* QUICK VIEW */}
        <Link
          to={`/product/${_id}`}
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-indigo-600 text-white opacity-0 shadow-lg transition-all duration-300 hover:bg-indigo-700 group-hover:translate-y-0 group-hover:opacity-100"
          title="View Product"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col p-4">
        {/* CATEGORY */}
        {category?.name && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {category.name}
          </p>
        )}

        {/* PRODUCT NAME */}
        <Link to={`/product/${_id}`}>
          <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900 transition-colors duration-300 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
            {name}
          </h2>
        </Link>

        {/* RATING */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 dark:bg-yellow-950/40">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />

            <span className="text-xs font-bold text-gray-800 dark:text-yellow-300">
              {ratings?.toFixed(1) || "0.0"}
            </span>
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({reviewsCount || 0} Reviews)
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            ₹{finalPrice?.toLocaleString("en-IN")}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {discount > 0 && (
          <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
            You save ₹{(price - finalPrice).toLocaleString("en-IN")}
          </p>
        )}

        {/* SPACER */}
        <div className="flex-1" />

        {/* DIVIDER */}
        <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={handleAddtoCart}
            disabled={stock <= 0 || isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none dark:shadow-none"
          >
            <ShoppingCart size={17} />

            {isPending ? "Adding..." : "Add To Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={stock <= 0}
            className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500 dark:hover:bg-indigo-950"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
