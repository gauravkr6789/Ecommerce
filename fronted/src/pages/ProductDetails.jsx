import { useParams, useNavigate } from "react-router-dom";

import { useProduct } from "../hooks/product/useProduct.js";
import { useAddcart } from "../hooks/cart/useCart.js";

import ProductImageGallery from "../components/ProductImageGallery.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id);

  const {
    mutate: addCart,
    isPending: isAddingToCart,
  } = useAddcart();

  // ==========================
  // BUY NOW
  // ==========================

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        buyNow: {
          productId: product._id,
          product: product,
          quantity: 1,
        },
      },
    });
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const handleAddToCart = () => {
    addCart({
      productId: product._id,
      quantity: 1,
    });
  };

  if (isLoading) {
    return <p className="p-10">Loading...</p>;
  }

  if (isError) {
    return (
      <div className="p-10 text-red-500">
        {error?.response?.data?.message || "Failed to load product"}
      </div>
    );
  }

  if (!product) {
    return <p className="p-10">Product not found</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 grid md:grid-cols-2 gap-8">

        {/* ==========================
            PRODUCT IMAGES
        ========================== */}

        <ProductImageGallery
          images={product.images}
          productName={product.name}
        />

        {/* ==========================
            PRODUCT DETAILS
        ========================== */}

        <div>
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-2">
            {product.description}
          </p>

          <p className="text-2xl mt-4 font-semibold">
            ₹{product.price?.toLocaleString()}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Category: {product.category?.name || "-"}
          </p>

          <p className="text-sm text-gray-500">
            Stock: {product.stock}
          </p>

          {/* ==========================
              BUTTONS
          ========================== */}

          <div className="mt-6 flex gap-4">

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;