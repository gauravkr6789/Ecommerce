import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const {user}=useAuth()
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* Google Auth */}
      <Route
        path="/auth/google/callback"
        element={<GoogleCallback />}
      />

      {/* Protected Home Route */}
      <Route
        path="/home"
        element={
          
            <Home />
          
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <h1 className="text-white text-3xl">
              Admin Dashboard
            </h1>
          </AdminRoute>
        }
      />

      {/* Default Routes */}
      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/home" replace />}
      />

     <Route
  path="/product/:id"
  element={<ProductDetail />}
/>
<Route
        path="/cart"
        element={
          user ? (
            <Cart />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

export default App;