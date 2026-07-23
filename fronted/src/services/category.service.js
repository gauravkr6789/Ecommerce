import axiosInstance from "../services/Axios.js";


export const createCategory = async (categoryData) => {
  const res = await axiosInstance.post(
    "/categories/create",
    categoryData
  );

  return res.data.data;
};


export const getAllCategories = async () => {
  const res = await axiosInstance.get("/categories/get-all");

  return res.data.data;
};


export const getCategoryById = async (id) => {
  const res = await axiosInstance.get(
    `/categories/get-single/${id}`
  );

  return res.data.data;
};


export const updateCategory = async ({ id, categoryData }) => {
  const res = await axiosInstance.put(
    `/categories/update/${id}`,
    categoryData
  );

  return res.data.data;
};


export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(
    `/categories/delete/${id}`
  );

  return res.data;
};