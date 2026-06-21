

import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  User,
  LogOut,
  Home,
  Store,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const { user, logoutMutation } = useAuth();
  //console.log("user :",user)

  const { carts } = useCart();
  //console.log("cart:",carts)

  const navigate = useNavigate();

  
  const cartCount =
    carts?.items?.reduce(
      (acc, item) => acc + item.quantity,
      0
    ) || 0;

  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#030712]/95 backdrop-blur-xl border-b border-white/10">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-8">
          
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Store
                size={22}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ShopSphere
              </h1>

              <p className="text-[10px] text-gray-500 -mt-1">
                Premium Shopping
              </p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden lg:flex items-center gap-4">
            
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Home size={18} />

              <span className="text-sm font-medium">
                Home
              </span>
            </Link>

            <button
              onClick={() => {
                document
                  .getElementById("products-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Sparkles size={18} />

              <span className="text-sm font-medium">
                Collections
              </span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* USER INFO */}
          <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
              <User
                size={18}
                className="text-white"
              />
            </div>

            <div className="leading-tight">
              
              <h3 className="text-sm font-semibold text-white capitalize">
                {user?.username || "Guest"}
              
              </h3>

              <p className="text-xs text-gray-400 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all duration-300"
          >
            <ShoppingCart
              size={21}
              className="text-white"
            />

            {/* CART BADGE */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40">
                {cartCount}
              </span>
            )}
          </Link>

          {/* LOGIN / LOGOUT */}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400"
            >
              <LogOut size={18} />

              <span className="hidden md:block">
                Logout
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;