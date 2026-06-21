
import React from "react";
import axios from "axios";

const axiosinstance = axios.create({
  baseURL: "http://localhost:3500/api",
});

axiosinstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosinstance;