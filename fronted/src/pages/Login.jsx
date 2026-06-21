import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/home");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-300" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-3 rounded-lg font-semibold"
          >
            <LogIn size={18} />
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-gray-300">
          <div className="flex-1 h-px bg-gray-400"></div>
          OR
          <div className="flex-1 h-px bg-gray-400"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={() =>
            (window.location.href =
              "http://localhost:3500/api/auth/google")
          }
          className="w-full bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        {/* Signup Redirect */}
        <p className="text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;