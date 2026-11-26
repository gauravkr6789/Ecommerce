import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  MapPin,
  Tag,
  CreditCard,
  Check,
  Trash2,
  ShieldCheck,
  Truck,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

import { useCart } from "../hooks/cart/useCart.js";
import { getAddresses, createAddress } from "../services/address.service.js";
import { getCouponByCode } from "../services/coupon.service.js";
import { createCheckoutOrder } from "../services/checkout.service.js";
import {
  createOrder as createPaymentOrder,
  verifyPayment,
} from "../services/payment.service";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: cart, isLoading: cartLoading } = useCart();
  const buyNow = location.state?.buyNow || null;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // CHECKOUT ITEMS
  const items = useMemo(() => {
    if (buyNow) {
      return [
        {
          product: buyNow.product,
          quantity: buyNow.quantity,
        },
      ];
    }

    return cart?.items || [];
  }, [buyNow, cart]);

  // SUBTOTAL
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.product?.price ?? item.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const totalAmount = Math.max(subtotal - discount, 0);

  // LOAD ADDRESSES
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);

      const res = await getAddresses();
      const list = res?.data || [];

      setAddresses(list);

      const defaultAddress = list.find((item) => item.isDefault) || list[0];

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  // ADDRESS INPUT
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // CREATE ADDRESS
  const handleCreateAddress = async (e) => {
    e.preventDefault();

    try {
      setAddressLoading(true);

      const res = await createAddress(addressForm);
      const newAddress = res?.data;

      if (!newAddress) {
        throw new Error("Address creation failed");
      }

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress);
      setShowAddressForm(false);

      setAddressForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });

      toast.success("Address added successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to create address",
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // APPLY COUPON
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    try {
      setLoading(true);

      const couponRes = await getCouponByCode(couponCode.trim().toUpperCase());

      const couponData = couponRes?.coupon;

      if (!couponData) {
        toast.error("Invalid coupon");
        return;
      }

      if (couponData.minOrderAmount && subtotal < couponData.minOrderAmount) {
        toast.error("Minimum order amount is ₹" + couponData.minOrderAmount);
        return;
      }

      let calculatedDiscount = 0;

      if (couponData.discountType === "percentage") {
        calculatedDiscount = (subtotal * couponData.discountValue) / 100;

        if (
          couponData.maxDiscount &&
          calculatedDiscount > couponData.maxDiscount
        ) {
          calculatedDiscount = couponData.maxDiscount;
        }
      } else {
        calculatedDiscount = couponData.discountValue;
      }

      calculatedDiscount = Math.min(calculatedDiscount, subtotal);

      setCoupon(couponData);
      setDiscount(calculatedDiscount);

      toast.success("Coupon applied");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid coupon");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  // LOAD RAZORPAY
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // PAYMENT
  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!items.length) {
      toast.error("No items to checkout");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: CREATE DB ORDER
      const orderPayload = {
        source: buyNow ? "buyNow" : "cart",

        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },

        ...(buyNow && {
          productId: buyNow.productId || buyNow.product?._id,
          quantity: buyNow.quantity,
        }),

        ...(coupon && {
          couponId: coupon._id,
          code: coupon.code,
        }),
      };

      const orderResponse = await createCheckoutOrder(orderPayload);

      if (!orderResponse?.success || !orderResponse?.order) {
        throw new Error(orderResponse?.message || "Order creation failed");
      }

      const dbOrder = orderResponse.order;
      console.log("dbOrder:", dbOrder);

      // STEP 2: CREATE RAZORPAY ORDER
      const paymentResponse = await createPaymentOrder({
        orderId: dbOrder._id,
      });

      if (!paymentResponse?.success) {
        throw new Error(
          paymentResponse?.message || "Payment order creation failed",
        );
      }

      // STEP 3: LOAD RAZORPAY
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // STEP 4: OPEN RAZORPAY
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentResponse.amount * 100,
        currency: "INR",
        name: "Ecommerce",
        description: "Ecommerce Order Payment",
        order_id: paymentResponse.razorpayOrderId,

        handler: async function (response) {
          try {
            setLoading(true);

            // STEP 5: VERIFY PAYMENT
            console.log("razorpayOrderId:", response.razorpay_order_id);
            console.log("razorpaypaymentId:", response.razorpay_payment_id);
            console.log("razorpaySignature:", response.razorpay_signature);

            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse?.success) {
              toast.success("Payment successful!");

              navigate("/payment-success/" + dbOrder._id);
            } else {
              toast.error("Payment verification failed");

              navigate("/payment-failed/" + dbOrder._id);
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Payment verification failed",
            );

            navigate("/payment-failed/" + dbOrder._id);
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.phone,
        },

        notes: {
          orderId: dbOrder._id,
        },

        theme: {
          color: "#111827",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log("Payment failed:", response);

        toast.error("Payment failed");

        navigate("/payment-failed/" + dbOrder._id);
      });

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );

      setLoading(false);
    }
  };

  // LOADING
  if (cartLoading && !buyNow) {
    return (
      <div className="checkout-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (!items.length) {
    return (
      <div className="checkout-page min-h-screen flex flex-col justify-center items-center px-5">
        <div className="bg-white rounded-2xl shadow-sm border p-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <CreditCard size={28} />
          </div>

          <h1 className="text-2xl font-bold mt-5">No items found</h1>

          <p className="text-gray-500 mt-2">
            Add something to your cart before checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-black text-white px-7 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="checkout-page min-h-screen">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Checkout
              </h1>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">Cart</span>

                <ChevronRight size={15} />

                <span className="font-medium text-gray-900">Checkout</span>

                <ChevronRight size={15} />

                <span>Payment</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck size={19} />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-7">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* ADDRESS */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">Shipping Address</h2>

                    <p className="text-sm text-gray-500">
                      Select where you want your order delivered
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="hidden sm:flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
                >
                  <Plus size={17} />
                  Add Address
                </button>
              </div>

              <div className="p-6">
                {/* MOBILE BUTTON */}
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="sm:hidden w-full mb-5 flex justify-center items-center gap-2 border border-gray-300 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50"
                >
                  <Plus size={17} />
                  Add Address
                </button>

                {/* ADDRESS FORM */}
                {showAddressForm && (
                  <form
                    onSubmit={handleCreateAddress}
                    className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5"
                  >
                    <div className="mb-5">
                      <h3 className="font-bold">Add New Address</h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Enter your delivery details
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>

                        <input
                          name="fullName"
                          placeholder="John Doe"
                          value={addressForm.fullName}
                          onChange={handleAddressChange}
                          required
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone
                        </label>

                        <input
                          name="phone"
                          placeholder="9876543210"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          required
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          Address
                        </label>

                        <textarea
                          name="address"
                          placeholder="House no, street, area"
                          value={addressForm.address}
                          onChange={handleAddressChange}
                          required
                          rows={3}
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          City
                        </label>

                        <input
                          name="city"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          required
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          State
                        </label>

                        <input
                          name="state"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          required
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Pincode
                        </label>

                        <input
                          name="pincode"
                          placeholder="110001"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          required
                          className="checkout-input mt-1.5 w-full border border-gray-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                        />
                      </div>

                      <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressChange}
                          className="w-4 h-4"
                        />
                        Make this my default address
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-5">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm hover:bg-white"
                      >
                        Cancel
                      </button>

                      <button
                        disabled={addressLoading}
                        className="px-6 py-2.5 rounded-xl bg-black text-white font-semibold text-sm disabled:opacity-50"
                      >
                        {addressLoading ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </form>
                )}

                {/* ADDRESSES */}
                {addressLoading && !addresses.length ? (
                  <div className="py-8 text-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

                    <p className="text-sm text-gray-500 mt-3">
                      Loading addresses...
                    </p>
                  </div>
                ) : addresses.length ? (
                  <div className="grid gap-4">
                    {addresses.map((address) => {
                      const selected = selectedAddress?._id === address._id;

                      return (
                        <label
                          key={address._id}
                          className={
                            "relative block cursor-pointer rounded-2xl border-2 p-5 transition " +
                            (selected
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-400")
                          }
                        >
                          {selected && (
                            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={16} />
                            </div>
                          )}

                          <div className="flex gap-4">
                            <input
                              type="radio"
                              name="address"
                              checked={selected}
                              onChange={() => setSelectedAddress(address)}
                              className="mt-1 w-4 h-4 accent-black"
                            />

                            <div className="pr-8">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold">
                                  {address.fullName}
                                </h3>

                                {address.isDefault && (
                                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 mt-1">
                                {address.phone}
                              </p>

                              <p className="text-sm text-gray-600 leading-6 mt-2">
                                {address.address}, {address.city},{" "}
                                {address.state} - {address.pincode}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-gray-300 rounded-2xl">
                    <MapPin size={30} className="mx-auto text-gray-400" />

                    <p className="font-semibold mt-3">No address found</p>

                    <p className="text-sm text-gray-500 mt-1">
                      Add an address to continue.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ORDER ITEMS */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Truck size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">Order Items</h2>

                    <p className="text-sm text-gray-500">
                      {items.length} {items.length === 1 ? "item" : "items"} in
                      your order
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {items.map((item, index) => {
                  const product = item.product;
                  const price = product?.price ?? item.price ?? 0;
                  const image = product?.images?.[0]?.url;

                  return (
                    <div
                      key={item._id || product?._id || index}
                      className="flex gap-4 md:gap-5 pb-5 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border">
                        {image ? (
                          <img
                            src={import.meta.env.VITE_SERVER_URL + image}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base md:text-lg truncate">
                          {product?.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          ₹{price.toLocaleString()} per item
                        </p>

                        <div className="inline-flex items-center bg-gray-100 rounded-lg px-3 py-1.5 mt-3 text-sm font-medium">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="font-bold text-base md:text-lg whitespace-nowrap">
                        ₹{(price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-6 space-y-5">
              {/* SUMMARY */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b">
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review your order before payment
                  </p>
                </div>

                <div className="p-6">
                  {/* COUPON */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={18} />

                      <h3 className="font-bold">Apply Coupon</h3>
                    </div>

                    {!coupon ? (
                      <div className="flex gap-2">
                        <input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon"
                          className="checkout-input min-w-0 flex-1 border border-gray-300 p-3 rounded-xl uppercase outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                        />

                        <button
                          onClick={handleApplyCoupon}
                          disabled={loading}
                          className="px-4 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                                <Check size={14} />
                              </div>

                              <p className="font-bold text-green-700">
                                {coupon.code}
                              </p>
                            </div>

                            <p className="text-sm text-green-700 mt-2">
                              You saved ₹{discount.toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={removeCoupon}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100"
                            title="Remove coupon"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t my-6" />

                  {/* PRICE */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>

                      <span className="font-medium text-gray-900">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>

                      <span className="font-semibold text-green-600">FREE</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>

                      <span className="font-medium text-green-600">
                        - ₹{discount.toLocaleString()}
                      </span>
                    </div>

                    <div className="border-t pt-5 flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>

                      <span className="text-2xl font-black">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* PAY */}
                  <button
                    onClick={handlePayment}
                    disabled={loading || !selectedAddress}
                    className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={19} />

                    {loading
                      ? "Processing Payment..."
                      : "Pay ₹" + totalAmount.toLocaleString()}
                  </button>

                  {!selectedAddress && (
                    <p className="text-red-500 text-xs text-center mt-3">
                      Please select a shipping address
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-5">
                    <ShieldCheck size={16} />
                    Secure payment powered by Razorpay
                  </div>
                </div>
              </section>

              {/* BENEFITS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Truck size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>

                    <p className="text-xs text-gray-500 mt-1">
                      Fast and reliable delivery to your address.
                    </p>
                  </div>
                </div>

                <div className="border-t my-4" />

                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">Secure Checkout</p>

                    <p className="text-xs text-gray-500 mt-1">
                      Your payment information is protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
