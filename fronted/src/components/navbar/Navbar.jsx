import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import UserMenu from "../ui/UserMenu";
import { useAuth } from "../../hooks/auth/useAuth";
import { useTheme } from "../../hooks/theme/useTheme";

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggletheme } = useTheme();

  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-10">

          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600"
          >
            ShopMate
          </Link>

          <nav className="hidden lg:flex items-center gap-6">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
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
              className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 py-2 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
            />

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Theme Toggle */}
          <button
            onClick={toggletheme}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "light" ? (
              <Moon
                size={22}
                className="text-gray-700 dark:text-white"
              />
            ) : (
              <Sun
                size={22}
                className="text-yellow-400"
              />
            )}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hidden sm:block"
          >

            <Heart
              size={24}
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 transition"
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
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                {cartCount}
              </span>
            )}

          </Link>

          {/* User */}
          {user ? (
            <div className="flex items-center gap-3">
              <UserMenu />
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              Login
            </Link>
          )}

          {/* Mobile */}
          <button className="block lg:hidden">

            <Menu
              size={28}
              className="text-gray-700 dark:text-gray-200"
            />

          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;