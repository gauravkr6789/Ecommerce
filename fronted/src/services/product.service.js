import axiosInstance from "./Axios.js";

export const getAllProducts = async (params = {}) => {
  const res = await axiosInstance.get("/products/get-all-Product", {
    params,
  });

  return res.data
};

export const getProductById = async (id) => {
  const res = await axiosInstance.get(`/products/get-ProductById/${id}`);
  return res.data.product;
};

export const createProduct = async (productData) => {
  const res = await axiosInstance.post("/products/add-product", productData);
  return res.data;
};

export const updateProduct = async ({ id, productData }) => {
  const res = await axiosInstance.put(
    `/products/update-product/${id}`,
    productData,
  );
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/products/delete-product/${id}`);
  return res.data;
};
