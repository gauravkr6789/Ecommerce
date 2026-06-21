import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLoginMutation } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const username = params.get("username");
    const avatar = params.get("avatar");
    const role = params.get("role");

    if (token) {
      googleLoginMutation.mutate(
        {
          token,
          user: { username, avatar, role },
        },
        {
          onSuccess: () => navigate("/home"),
        }
      );
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Logging in with Google...</p>;
};

export default GoogleCallback;