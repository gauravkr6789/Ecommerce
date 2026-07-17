import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home.jsx"
import ProductDetail from "../pages/ProductDetails.jsx"

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import GoogleCallback from "../pages/auth/GoogleCallback.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

import MainLayout from "../layouts/MainLayout.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}

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

      {/* Protected Layout */}

      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      {/* User Dashboard */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <h1>Profile Page</h1>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <MainLayout>
              <h1>Admin Dashboard</h1>
            </MainLayout>
          </AdminRoute>
        }
      />

      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default AppRoutes;