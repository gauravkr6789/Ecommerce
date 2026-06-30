import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/Axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // USER
  const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    const res = await axiosInstance.get("/auth/me");
    console.log("AUTH ME RESPONSE =>", res.data);
    return res.data.data.user;
  },
  enabled: !!localStorage.getItem("token"),
});

  // LOGIN
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", res.data.data.token);

      return res.data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success("Login Success");
    },
  });

  // REGISTER
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.post("/auth/register", data);
    },
    onSuccess: () => toast.success("Account Created"),
  });

  // FORGOT
  const forgotMutation = useMutation({
    mutationFn: async (email) => {
      return await axiosInstance.post("/auth/forgot-password", {
        email,
      });
    },
  });

  // RESET
  const resetMutation = useMutation({
    mutationFn: async ({ token, password }) => {
      return await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { password }
      );
    },
  });

  // GOOGLE CALLBACK HANDLER
  const googleLogin = ({ token, user }) => {
    localStorage.setItem("token", token);
    queryClient.setQueryData(["user"], user);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginMutation,
        registerMutation,
        forgotMutation,
        resetMutation,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext