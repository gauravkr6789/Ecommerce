import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Lock } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPasswordMutation } = useAuth();

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    resetPasswordMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-indigo-900">
      <form className="bg-white/10 p-8 rounded-xl w-96" onSubmit={handleSubmit}>
        <h2 className="text-white text-2xl mb-4">Reset Password</h2>

        <div className="relative mb-4">
          <Lock className="absolute left-2 top-3 text-white" size={18} />
          <input
            type="password"
            placeholder="New password"
            className="w-full pl-8 p-3 rounded bg-white/20 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-indigo-600 p-3 rounded text-white">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;