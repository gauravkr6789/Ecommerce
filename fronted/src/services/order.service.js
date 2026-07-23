import axiosInstance from "../services/Axios";

export const getUserOrders = async (params = {}) => {
  const res = await axiosInstance.get("/orders/get-order", {
    params,
  });

  return res.data;
};


export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`/orders/get-order/${id}`);

  return res.data;
};