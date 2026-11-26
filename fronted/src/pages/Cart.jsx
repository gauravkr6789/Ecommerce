import React from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

import {
  useCart,
  useUpdatecart,
  useRemovecart,
  useClearcart,
} from "../hooks/cart/useCart.js";

function Cart() {
  // ==========================
  // GET CART
  // ==========================

  const {
    data: carts,
    isLoading,
    isError,
  } = useCart();

  // ==========================
  // MUTATIONS
  // ==========================

  const updateCartMutation = useUpdatecart();
  const removeCartMutation = useRemovecart();
  const clearCartMutation = useClearcart();

  // ==========================
  // IMAGE URL
  // ==========================

  const getImageUrl = (image) => {
    if (!image) return "";

    // image = { url: "/uploads/abc.jpg" }
    if (typeof image === "object") {
      const imagePath = image.url;

      if (!imagePath) return "";

      if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
      ) {
        return imagePath;
      }

      return `${import.meta.env.VITE_API_URLL}${imagePath}`;
    }

    // image = "/uploads/abc.jpg"
    if (typeof image === "string") {
      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }

      return `${import.meta.env.VITE_API_URLL}${image}`;
    }

    return "";
  };

  // ==========================
  // LOADING
  // ==========================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading cart...
      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <h1 className="text-2xl font-bold text-red-600">
          Failed to load cart
        </h1>

        <p className="text-gray-500 mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  // ==========================
  // EMPTY CART
  // ==========================

  if (!carts?.items?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <ShoppingCart
          size={70}
          className="text-gray-400 mb-5"
        />

        <h1 className="text-4xl font-bold mb-3">
          Your Cart is Empty
        </h1>

        <p className="text-gray-500 mb-5">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ==========================
  // INCREASE QUANTITY
  // ==========================

  const handleIncrease = (item) => {
    console.log("item:", item);

    updateCartMutation.mutate({
      productId: item.product._id,
      quantity: item.quantity + 1,
    });
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const handleRemove = (productId) => {
    removeCartMutation.mutate(productId);
  };

  // ==========================
  // DECREASE QUANTITY
  // ==========================

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      handleRemove(item.product._id);
      return;
    }

    updateCartMutation.mutate({
      productId: item.product._id,
      quantity: item.quantity - 1,
    });
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  // ==========================
  // SUBTOTAL
  // ==========================

  const subtotal = carts.items.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  // ==========================
  // UI
  // ==========================

  return (
    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-5">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">

          <h1 className="text-4xl font-bold">
            Shopping Cart
          </h1>

          <button
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
            className="
              flex items-center justify-center gap-2
              border border-red-500 text-red-600
              px-4 py-2 rounded-lg
              hover:bg-red-50
              disabled:opacity-50
            "
          >
            <Trash2 size={18} />

            {clearCartMutation.isPending
              ? "Clearing..."
              : "Clear Cart"}
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ==========================
              CART ITEMS
          ========================== */}

          <div className="lg:col-span-2 space-y-5">

            {carts.items.map((item) => {

              const isUpdating =
                updateCartMutation.isPending &&
                updateCartMutation.variables?.productId ===
                  item.product._id;

              const isRemoving =
                removeCartMutation.isPending &&
                removeCartMutation.variables ===
                  item.product._id;

              return (
                <div
                  key={item._id}
                  className="
                    bg-white rounded-xl shadow p-5
                    flex flex-col md:flex-row gap-5
                  "
                >

                  {/* ==========================
                      IMAGE
                  ========================== */}

                  <img
                    src={getImageUrl(
                      item.product.images?.[0]
                    )}
                    alt={item.product.name}
                    className="
                      w-36 h-36
                      object-cover
                      rounded-lg
                      border
                    "
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* ==========================
                      PRODUCT INFO
                  ========================== */}

                  <div className="flex-1">

                    <h2 className="text-2xl font-semibold">
                      {item.product.name}
                    </h2>

                    <p className="text-lg text-gray-500 mt-2">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    {/* ==========================
                        QUANTITY
                    ========================== */}

                    <div className="flex items-center gap-3 mt-6">

                      <button
                        onClick={() =>
                          handleDecrease(item)
                        }
                        disabled={
                          isUpdating ||
                          isRemoving
                        }
                        className="
                          border rounded p-2
                          hover:bg-gray-100
                          disabled:opacity-50
                        "
                      >
                        <Minus size={18} />
                      </button>

                      <span className="
                        text-lg
                        font-semibold
                        min-w-[30px]
                        text-center
                      ">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleIncrease(item)
                        }
                        disabled={
                          isUpdating ||
                          isRemoving
                        }
                        className="
                          border rounded p-2
                          hover:bg-gray-100
                          disabled:opacity-50
                        "
                      >
                        <Plus size={18} />
                      </button>

                    </div>

                    {/* ==========================
                        REMOVE
                    ========================== */}

                    <button
                      onClick={() =>
                        handleRemove(
                          item.product._id
                        )
                      }
                      disabled={
                        isRemoving ||
                        isUpdating
                      }
                      className="
                        flex items-center gap-2
                        mt-6 text-red-600
                        hover:text-red-800
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={18} />

                      {isRemoving
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>

                  {/* ==========================
                      ITEM TOTAL
                  ========================== */}

                  <div className="text-right">

                    <h2 className="text-2xl font-bold">
                      ₹
                      {(
                        item.product.price *
                        item.quantity
                      ).toLocaleString()}
                    </h2>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ==========================
              ORDER SUMMARY
          ========================== */}

          <div>

            <div className="
              bg-white
              rounded-xl
              shadow
              p-6
              sticky
              top-24
            ">

              <h2 className="text-2xl font-bold mb-5">
                Order Summary
              </h2>

              {/* SUBTOTAL */}

              <div className="flex justify-between mb-3">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal.toLocaleString()}
                </span>

              </div>

              {/* SHIPPING */}

              <div className="flex justify-between mb-3">

                <span>
                  Shipping
                </span>

                <span className="text-green-600">
                  FREE
                </span>

              </div>

              {/* DISCOUNT */}

              <div className="flex justify-between mb-3">

                <span>
                  Discount
                </span>

                <span>
                  ₹0
                </span>

              </div>

              <hr className="my-4" />

              {/* TOTAL */}

              <div className="
                flex
                justify-between
                text-xl
                font-bold
              ">

                <span>
                  Total
                </span>

                <span>
                  ₹{subtotal.toLocaleString()}
                </span>

              </div>

              {/* CHECKOUT */}

              <Link
                to="/checkout"
                className="
                  block
                  w-full
                  mt-6
                  bg-black
                  text-white
                  py-3
                  rounded-lg
                  hover:bg-gray-800
                  text-center
                "
              >
                Proceed to Checkout
              </Link>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/"
                className="
                  block
                  text-center
                  w-full
                  mt-4
                  border
                  py-3
                  rounded-lg
                  hover:bg-gray-100
                "
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;