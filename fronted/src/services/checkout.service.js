import axiosInstance from "./Axios.js";

export const createCheckoutOrder = async (orderData) => {
  const res = await axiosInstance.post("/orders/create", orderData);

  return res.data;
};
