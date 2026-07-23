import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";

import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetails.jsx";
import Categories from "../pages/admin/Categories.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import Cart from "../pages/Cart.jsx";
import NotFound from "../pages/NotFound.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import GoogleCallback from "../pages/auth/GoogleCallback.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= Public Auth Routes ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/auth/google/callback"
        element={<GoogleCallback />}
      />

      {/* ================= Main Layout ================= */}

      <Route element={<MainLayout />}>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Products */}
        <Route path="/products" element={<Products />} />

        {/* Single Product */}
        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        {/* Categories */}
        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <h1 className="text-3xl font-bold">
                Profile Page
              </h1>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1 className="text-3xl font-bold">
                Admin Dashboard
              </h1>
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>
  );
};

export default AppRoutes;