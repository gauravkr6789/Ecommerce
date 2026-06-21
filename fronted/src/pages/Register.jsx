import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus } from "lucide-react";

function Register() {
  const { registerMutation } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    registerMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 🚀
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" method="post">

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-300" size={18} />
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

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

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-300" size={18} />
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone"
              value={formData.phone}
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
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="user" className="text-black">User</option>
              <option value="admin" className="text-black">Admin</option>
              <option value="delivery" className="text-black">Delivery</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-3 rounded-lg font-semibold"
          >
            <UserPlus size={18} />
            {registerMutation.isPending ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;