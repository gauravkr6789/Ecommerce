import { Routes, Route } from "react-router-dom";
import "../styles/globals.css";

import MainLayout from "../../src/layouts/MainLayout.jsx";

// Public Pages
import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetails.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import Cart from "../pages/Cart.jsx";
import NotFound from "../../src/pages/NotFound.jsx";

// Admin Layout and Pages
import AdminLayout from '../../src/layouts/AdminLayout.jsx'
import Dashboard from "../admin/pages/Dashboard.jsx";

import {
  Products as AdminProducts,
  Orders,
  Customers,
  Coupons,
  Payments,
  Refunds,
  Delivery,
} from "../admin/pages/ManagementPages.jsx";

import Analytics from "../admin/pages/Analytics.jsx";
import Settings from "../admin/pages/Settings.jsx";

// Auth
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import GoogleCallback from "../pages/auth/GoogleCallback.jsx";

// Route Protection
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

// Checkout / Payment
import Checkout from "../pages/Checkout.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import PaymentFailed from "../pages/PaymentFailed.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Customer Layout */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/categories" element={<Categories />} />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success/:orderId"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-failed/:orderId"
          element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <h1 className="text-3xl font-bold">Profile Page</h1>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Layout */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="payments" element={<Payments />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />

        {/* Existing Product CRUD */}

        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/edit/:id" element={<UpdateProduct />} />
      </Route>

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
