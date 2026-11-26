import axiosInstance from "./Axios.js";

export const addToCart = async (cartData) => {
  const res = await axiosInstance.post("/carts/add-cart", cartData);

  return res.data.cart;
};

export const getUserCart = async () => {
  const res = await axiosInstance.get("/carts/get-user-cart");

  return res.data.cart;
};

export const updateCart = async ({ productId, quantity }) => {
  const response = await axios.put(`/carts/update/${productId}`, {
    quantity,
  });

  return response.data.cart;
};

export const removeCart = async (productId) => {
  const res = await axiosInstance.delete(`/carts/remove-cart/${productId}`);

  return res.data.cart;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete("/carts/clear-cart");

  return res.data;
};
