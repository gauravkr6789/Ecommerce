import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import GoogleCallback from "../pages/auth/GoogleCallback";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import MainLayout from "../layouts/MainLayout";

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
    </Routes>
  );
};

export default AppRoutes;