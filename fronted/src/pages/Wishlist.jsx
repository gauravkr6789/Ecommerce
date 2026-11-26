import { Heart, Trash2, ShoppingBag, ArrowRight, Star } from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useWishlist from "../hooks/wishlist/useWishlist.js";

const Wishlist = () => {
  const { wishlist, isLoading, error, removeWishlist } = useWishlist();

  // REMOVE PRODUCT
  const handleRemove = (productId) => {
    removeWishlist(productId, {
      onSuccess: () => {
        toast.success("Product removed from wishlist");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to remove product",
        );
      },
    });
  };

  // IMAGE URL
  const getImageUrl = (images) => {
    const image = images?.[0]?.url;

    if (!image) return "/placeholder.png";

    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_API_URLL}${image}`;
  };

  // PRICE
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN").format(price || 0);

  // LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 animate-pulse"
              >
                <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500">
          {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart size={28} className="text-red-500 fill-red-500" />

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h1>
            </div>

            <p className="text-gray-500 dark:text-gray-400">
              Your favorite products, all in one place.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Saved Products
            </span>

            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {wishlist.length} Items
            </p>
          </div>
        </div>

        {/* EMPTY WISHLIST */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-20 px-5 text-center">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={42} className="text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Your Wishlist is Empty
            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              You haven't added any products yet. Explore our collection and
              save your favorites.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <ShoppingBag size={18} />
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const discount =
                product.discountPrice > 0 && product.price
                  ? Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={getImageUrl(product.images)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition text-red-500"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* DISCOUNT */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 transition min-h-14">
                        {product.name}
                      </h2>
                    </Link>

                    {/* CATEGORY */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {product.category?.name || "Product"}
                    </p>

                    {/* RATING */}
                    <div className="flex items-center gap-1 mt-2">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {product.ratings?.toFixed(1) || "0.0"}
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({product.reviewsCount || 0} Reviews)
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        ₹
                        {formatPrice(
                          product.discountPrice > 0
                            ? product.discountPrice
                            : product.price,
                        )}
                      </span>

                      {product.discountPrice > 0 && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* STOCK */}
                    <p
                      className={`mt-2 text-sm font-medium ${
                        product.stock > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    {/* VIEW PRODUCT */}
                    <div className="mt-5">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium"
                      >
                        View Product
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
