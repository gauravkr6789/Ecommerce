import { Routes, Route } from "react-router-dom";
import "../styles/globals.css";

import MainLayout from "../layouts/MainLayout.jsx";

// ================= Pages =================

import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetails.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import Cart from "../pages/Cart.jsx";
import NotFound from "../pages/NotFound.jsx";

// ================= Admin Pages =================

import Categories from "../pages/admin/Categories.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";

import AdminProducts from "../pages/admin/Products.jsx"
import CreateProduct from "../pages/admin/Create.jsx";
import UpdateProduct from "../pages/admin/Edit.jsx"

// ================= Auth =================

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import GoogleCallback from "../pages/auth/GoogleCallback.jsx";

// ================= Routes =================

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

// ================= Checkout / Payment =================

import Checkout from "../pages/Checkout.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import PaymentFailed from "../pages/PaymentFailed.jsx";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= Public Auth Routes ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

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

        {/* ================= Public Pages ================= */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products />}
        />

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


        {/* ================= Protected User Pages ================= */}

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

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Payment Success */}
        <Route
          path="/payment-success/:orderId"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* Payment Failed */}
        <Route
          path="/payment-failed/:orderId"
          element={
            <ProtectedRoute>
              <PaymentFailed />
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


        {/* ================= Admin ================= */}

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Admin Products */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        {/* Create Product */}
        <Route
          path="/admin/products/create"
          element={
            <AdminRoute>
              <CreateProduct />
            </AdminRoute>
          }
        />

        {/* Update Product */}
        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>
  );
};

export default AppRoutes;