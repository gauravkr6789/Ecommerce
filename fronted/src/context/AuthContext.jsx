import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "../services/Axios.jsx";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosinstance.get("/auth/me");
      return res.data.data.user;
    },
    enabled: !!localStorage.getItem("token"),
  });

 
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosinstance.post("/auth/login", formData);
      const { user, token } = res.data.data;

      localStorage.setItem("token", token);
      return user;
    },
    onSuccess: (user) => {
      toast.success("Login successful 🎉");
      queryClient.setQueryData(["user"], user);

       if (user.role === "admin") {
      window.location.href = "/admin-dashboard";
    } else if (user.role === "delivery") {
      window.location.href = "/delivery-dashboard";
    } else {
      window.location.href = "/user-dashboard";
    }
  },
    
    onError:(err) => {
      toast.error(err.response?.data?.message || "Login failed");
    },
  });

  
  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosinstance.post("/auth/register", formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully 🚀");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Register failed");
    },
  });

 
  const googleLoginMutation = useMutation({
    mutationFn: async ({ token, user }) => {
      localStorage.setItem("token", token);
      return user;
    },
    onSuccess: (user) => {
      toast.success("Google login successful 🎉");
      queryClient.setQueryData(["user"], user);
    },
  });


  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const res = await axiosinstance.post("/auth/forget-password", { email });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reset link sent 📧");
    },
    onError: () => {
      toast.error("Failed to send email");
    },
  });

  
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }) => {
      const res = await axiosinstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful 🔑");
    },
    onError: () => {
      toast.error("Reset failed");
    },
  });

  // ✅ LOGOUT
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      toast.success("Logged out");
      queryClient.clear();
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        role: user?.role,
        loginMutation,
        registerMutation,
        googleLoginMutation,
        forgotPasswordMutation,
        resetPasswordMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);