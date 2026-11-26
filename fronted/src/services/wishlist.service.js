
import axiosInstance from "./Axios.js";

// ADD TO WISHLIST
export const addToWishlist = async (productId) => {
  const res = await axiosInstance.post("/wishlist/add", {
    productId,
  });

  return res.data.data;
};

// GET WISHLIST
export const getWishlist = async () => {
  const res = await axiosInstance.get("/wishlist");

  return res.data.data;
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (productId) => {
  const res = await axiosInstance.delete(
    `/wishlist/remove/${productId}`
  );

  return res.data.data;
};

// CLEAR WISHLIST
export const clearWishlist = async () => {
  const res = await axiosInstance.delete("/wishlist/clear");

  return res.data.data;
};
