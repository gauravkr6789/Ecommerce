import axiosInstance from "./Axios.js";

export const createOrder = async (orderData) => {
  const res = await axiosInstance.post("/payment/create-order", orderData);

  return res.data;
};

export const verifyPayment = async (paymentData) => {
  const res = await axiosInstance.post("/payment/verify-payment", paymentData);

  return res.data;
};
