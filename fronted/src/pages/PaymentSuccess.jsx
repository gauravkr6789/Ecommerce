import React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccess() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">

      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg w-full">

        <CheckCircle
          size={80}
          className="mx-auto text-green-500"
        />

        <h1 className="text-4xl font-bold mt-5">
          Payment Successful!
        </h1>

        <p className="text-gray-500 mt-3">
          Your order has been placed successfully.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mt-6">
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="font-semibold break-all">
            {orderId}
          </p>
        </div>

        <div className="flex gap-3 mt-7">

          <Link
            to="/orders"
            className="flex-1 bg-black text-white py-3 rounded-lg"
          >
            View Orders
          </Link>

          <Link
            to="/"
            className="flex-1 border py-3 rounded-lg"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PaymentSuccess;