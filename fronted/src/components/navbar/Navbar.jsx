import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
} from "lucide-react";
import UserMenu from "../ui/UserMenu";
import { useAuth } from "../../hooks/auth/useAuth.js";

const Navbar = () => {
  const { user } = useAuth();

  // Temporary counts (later API se replace kar dena)
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600"
          >
            ShopMate
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }
            >
              Categories
            </NavLink>
          </nav>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-300 py-2 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hidden sm:block"
          >
            <Heart
              size={24}
              className="text-gray-700 hover:text-red-500 transition"
            />

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart
              size={24}
              className="text-gray-700 hover:text-indigo-600 transition"
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / User */}
          {user ? (
            <UserMenu />
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <button className="block lg:hidden">
            <Menu
              size={28}
              className="text-gray-700"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;