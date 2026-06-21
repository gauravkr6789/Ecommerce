import React from "react";
import { useCart } from "../context/CartContext.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

function Cart() {
  const {
    carts,
    cartLoading,
    updateCartMutation,
    removeCartMutation,
    clearCartMutation,
  } = useCart();

  const API_URL = import.meta.env.REACT_APP_API_URL;

  // ================= LOADING =================
  if (cartLoading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center text-2xl font-semibold bg-black text-white">
          Loading Cart...
        </div>
      </>
    );
  }

  // ================= EMPTY CART =================
  if (!carts || carts.items?.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
          <ShoppingCart size={70} className="text-gray-500" />

          <h1 className="text-3xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="text-gray-400">
            Add some products to your cart
          </p>
        </div>
      </>
    );
  }

  // ================= HANDLERS =================
  const increaseQuantity = (item) => {
    updateCartMutation.mutate({
      productId: item.product._id,
      quantity: item.quantity + 1,
    });
  };

  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      removeCartMutation.mutate(item.product._id);
      return;
    }

    updateCartMutation.mutate({
      productId: item.product._id,
      quantity: item.quantity - 1,
    });
  };

  const removeItem = (productId) => {
    removeCartMutation.mutate(productId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* HEADING */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">
              Shopping Cart
            </h1>

            <button
              onClick={clearCart}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Clear Cart
            </button>
          </div>

          {/* CART ITEMS */}
          <div className="grid gap-6">
            {carts.items.map((item) => (
                console.log("image url :",item.product.image),
              <div
                key={item.product._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-5 flex flex-col md:flex-row gap-6 items-center"
              >
                {/* IMAGE */}
                <img
                  src={
                    item.cart.image
                      ? `${API_URL}/uploads/${item.cart.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={item.product.name}
                  className="w-40 h-40 object-cover rounded-xl border border-gray-700"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    {item.product.description}
                  </p>

                  <p className="text-2xl font-bold text-green-400 mt-4">
                    ₹{item.price}
                  </p>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="text-xl font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item)}
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* TOTAL */}
                <div className="text-center">
                  <p className="text-gray-400 mb-2">
                    Total
                  </p>

                  <p className="text-2xl font-bold text-blue-400">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeItem(item.product._id)
                  }
                  className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-full text-red-400 transition"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))}
          </div>

          {/* BILLING */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 mt-10 rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">
                Cart Summary
              </h2>

              <p className="text-3xl font-bold text-green-400">
                ₹{carts.totalPrice}
              </p>
            </div>

            <button className="w-full mt-6 bg-white text-black hover:bg-gray-200 py-4 rounded-xl text-xl font-semibold transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;