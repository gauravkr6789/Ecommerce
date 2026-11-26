import axiosInstance from "./Axios.js";

export const applyCoupon = async (couponId, code) => {
  const res = await axiosInstance.post(`/coupon/apply/${couponId}`, { code });

  return res.data;
};

export const getCouponByCode = async (code) => {
  const res = await axiosInstance.get(`/coupon/code/${code}`);

  return res.data;
};
