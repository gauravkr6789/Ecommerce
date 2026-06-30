import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
FaUser,
FaEnvelope,
FaPhone,
FaLock,
FaGoogle,
FaEye,
FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/auth/useAuth.js";

const Register = () => {
const navigate = useNavigate();
const { registerMutation } = useAuth();

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [formData, setFormData] = useState({
username: "",
email: "",
phone: "",
password: "",
confirmPassword: "",
role: "user",
});

const handleChange = (e) => {
setFormData((prev) => ({
...prev,
[e.target.name]: e.target.value,
}));
};

const handleSubmit = async (e) => {
e.preventDefault();


if (
  formData.password !==
  formData.confirmPassword
) {
  toast.error("Passwords do not match");
  return;
}

try {
  await registerMutation.mutateAsync({
    username: formData.username,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    role: formData.role,
    confirmPassword:formData.confirmPassword
  });

  toast.success(
    "Account Created Successfully"
  );

  navigate("/login");
} catch (err) {
  console.log(err);
}


};

const handleGoogleSignup = () => {
window.location.href =
"http://localhost:3500/api/auth/google";
};

return ( <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex items-center justify-center px-4 py-4"> <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-5">


    {/* Header */}
    <div className="text-center mb-5">
      <h1 className="text-xl font-bold text-slate-800">
        Create Account
      </h1>

      <p className="text-slate-500 text-sm mt-2">
        Join our ecommerce platform today
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >

      {/* Username */}
      <div className="relative">
        <FaUser className="absolute left-3 top-3.5 text-gray-400" />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Phone */}
      <div className="relative">
        <FaPhone className="absolute left-3 top-3.5 text-gray-400" />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Role */}
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="user">
          User
        </option>

        <option value="admin">
          Admin
        </option>
      </select>

      {/* Password */}
      <div className="relative">
        <FaLock className="absolute left-3 top-3.5 text-gray-400" />

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="absolute right-3 top-3.5 text-gray-500"
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <FaLock className="absolute left-3 top-3.5 text-gray-400" />

        <input
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
          className="absolute right-3 top-3.5 text-gray-500"
        >
          {showConfirmPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2.5 rounded-lg font-semibold"
      >
        {registerMutation.isPending
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-4">
      <div className="flex-1 border-t"></div>

      <span className="px-3 text-gray-500 text-xs">
        OR
      </span>

      <div className="flex-1 border-t"></div>
    </div>

    {/* Google Signup */}
    <button
      onClick={handleGoogleSignup}
      className="w-full border border-gray-300 py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
    >
      <FaGoogle />
      Continue with Google
    </button>

    {/* Login Link */}
    <p className="text-center mt-4 text-sm text-gray-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-indigo-600 font-semibold"
      >
        Login
      </Link>
    </p>

  </div>
</div>


);
};

export default Register;
