import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Mail } from "lucide-react";

function ForgotPassword() {
  const { forgotPasswordMutation } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-indigo-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-xl w-96"
      >
        <h2 className="text-white text-2xl mb-4">Forgot Password</h2>

        <div className="relative mb-4">
          <Mail className="absolute left-2 top-3 text-white" size={18} />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-8 p-3 rounded bg-white/20 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-indigo-600 p-3 rounded text-white">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;