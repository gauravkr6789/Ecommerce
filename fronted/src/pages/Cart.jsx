import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../hooks/cart/useCart";

function Cart() {
  const { data: carts, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!carts?.items?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <h1 className="text-4xl font-bold mb-3">🛒 Your Cart is Empty</h1>
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

  const subtotal = carts.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-5">

        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}

          <div className="lg:col-span-2 space-y-5">

            {carts.items.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row gap-5"
              >

                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${item.product.images?.[0]?.url}`}
                  alt={item.product.name}
                  className="w-36 h-36 object-cover rounded-lg border"
                />

                <div className="flex-1">

                  <h2 className="text-2xl font-semibold">
                    {item.product.name}
                  </h2>

                  <p className="text-lg text-gray-500 mt-2">
                    ₹{item.product.price.toLocaleString()}
                  </p>

                  {/* Quantity */}

                  <div className="flex items-center gap-3 mt-6">

                    <button className="border rounded p-2 hover:bg-gray-100">
                      <Minus size={18} />
                    </button>

                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>

                    <button className="border rounded p-2 hover:bg-gray-100">
                      <Plus size={18} />
                    </button>

                  </div>

                  {/* Remove */}

                  <button className="flex items-center gap-2 mt-6 text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                    Remove
                  </button>

                </div>

                {/* Item Total */}

                <div className="text-right">

                  <h2 className="text-2xl font-bold">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString()}
                  </h2>

                </div>

              </div>

            ))}

          </div>

          {/* Summary */}

          <div>

            <div className="bg-white rounded-xl shadow p-6 sticky top-24">

              <h2 className="text-2xl font-bold mb-5">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Discount</span>
                <span>₹0</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <button className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center w-full mt-4 border py-3 rounded-lg hover:bg-gray-100"
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