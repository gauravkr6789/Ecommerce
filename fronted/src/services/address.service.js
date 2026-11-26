import axiosInstance from "./Axios.js";

export const getAddresses = async () => {
  const res = await axiosInstance.get("/address");

  return res.data;
};

export const createAddress = async (addressData) => {
  const res = await axiosInstance.post("/address", addressData);

  return res.data;
};

export const updateAddress = async (id, addressData) => {
  const res = await axiosInstance.put(`/address/${id}`, addressData);

  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await axiosInstance.delete(`/address/${id}`);

  return res.data;
};
