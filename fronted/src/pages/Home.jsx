// Home.jsx

import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useProduct } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ShoppingBag,
  LogOut,
  ArrowRight,
  Sparkles,
  Star,
  ShoppingCart,
  Eye,
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";

function Home() {
  const { user, logoutMutation } = useAuth();

  const { products, productLoading } = useProduct();

  const { addToCartMutation } = useCart();

  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  // ================= GROUP PRODUCTS CATEGORY WISE =================
  const groupedProducts = products?.reduce((acc, product) => {
    const categoryName =
      product?.category?.name || "Uncategorized";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(product);

    return acc;
  }, {});

  // ================= ADD TO CART =================
  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(
            `${product.name} added to cart`
          );
        },

        onError: () => {
          toast.error("Failed to add product");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center min-h-[60vh] px-6 overflow-hidden">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl text-center">
          
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8 backdrop-blur-xl">
            
            <Sparkles
              size={16}
              className="text-yellow-400"
            />

            <span className="text-sm text-gray-300">
              Modern Shopping Experience
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            
            Discover Premium{" "}

            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore trending collections, smart gadgets,
            fashion, and premium lifestyle essentials
            crafted for modern shopping.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            
            {/* EXPLORE */}
            <button
              onClick={() => {
                document
                  .getElementById("products-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
            >
              
              <ShoppingBag size={20} />

              Explore Products

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </button>

            {/* LOGOUT */}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3"
              >
                <LogOut size={20} />

                Logout
              </button>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section
        id="products-section"
        className="px-4 md:px-8 lg:px-10 py-14"
      >
        
        <div className="max-w-7xl mx-auto">
          
          {/* HEADING */}
          <div className="mb-12">
            
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Trending Collections
            </h2>

            <p className="text-gray-400">
              Explore products category wise
            </p>
          </div>

          {/* LOADING */}
          {productLoading ? (
            <div className="flex justify-center items-center py-20">
              
              <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            Object.entries(groupedProducts || {}).map(
              ([category, items]) => (
                <div
                  key={category}
                  className="mb-14"
                >
                  
                  {/* CATEGORY HEADER */}
                  <div className="flex items-center justify-between mb-7">
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {category}
                    </h3>

                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                      View All
                    </button>
                  </div>

                  {/* PRODUCT GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    
                    {items.map((product) => (
                      <div
                        key={product._id}
                        className="group bg-[#111827] border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
                      >
                        
                        {/* IMAGE */}
                        <div className="relative overflow-hidden bg-black">
                          
                          <img
                            src={
                              product?.images?.[0]?.url
                                ? `http://localhost:3500${product.images[0].url}`
                                : "https://via.placeholder.com/400"
                            }
                            alt={product.name}
                            className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                          />

                          {/* SALE */}
                          {product.discountPrice && (
                            <div className="absolute top-3 left-3 bg-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              SALE
                            </div>
                          )}

                          {/* STOCK */}
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-xs px-3 py-1 rounded-full">
                            {product.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                          
                          {/* NAME */}
                          <h4 className="text-lg font-semibold line-clamp-1">
                            {product.name}
                          </h4>

                          {/* DESCRIPTION */}
                          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                            {product.description}
                          </p>

                          {/* RATING */}
                          <div className="flex items-center gap-2 mt-4">
                            
                            <Star
                              size={15}
                              className="text-yellow-400 fill-yellow-400"
                            />

                            <span className="text-sm text-gray-300">
                              {product.ratings || 4.5}
                            </span>
                          </div>

                          {/* PRICE */}
                          <div className="flex items-center gap-3 mt-4">
                            
                            <span className="text-2xl font-black text-indigo-400">
                              ₹
                              {product.discountPrice ||
                                product.price}
                            </span>

                            {product.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                            )}
                          </div>

                          {/* BUTTONS */}
                          <div className="mt-5 flex gap-3">
                            
                            {/* ADD TO CART */}
                            <button
                              onClick={() =>
                                handleAddToCart(product)
                              }
                              disabled={
                                addToCartMutation.isPending
                              }
                              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <ShoppingCart size={17} />

                              {addToCartMutation.isPending
                                ? "Adding..."
                                : "Add to Cart"}
                            </button>

                            {/* VIEW */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/product/${product._id}`
                                )
                              }
                              className="w-12 border border-white/10 hover:border-indigo-500/50 rounded-xl transition-all duration-300 flex items-center justify-center"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;