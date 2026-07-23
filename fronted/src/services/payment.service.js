import axiosInstance from "../services/Axios";


export const createOrder = async (orderData) => {
  const res = await axiosInstance.post(
    "/payment/create-order",
    orderData
  );

  return res.data;
};


export const verifyPayment = async (paymentData) => {
  const res = await axiosInstance.post(
    "/payment/verify-payment",
    paymentData
  );

  return res.data;
};


export const refundOrder = async (orderId) => {
  const res = await axiosInstance.post(
    `/payment/refund-payment/${orderId}`
  );

  return res.data;
};


export const cancelOrder = async (orderId) => {
  const res = await axiosInstance.delete(
    `/payment/cancel-payment/${orderId}`
  );

  return res.data;
};