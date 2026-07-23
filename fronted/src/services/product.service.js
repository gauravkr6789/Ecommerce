import axiosInstance from '../services/Axios.js'


export const getAllProducts = async (params={}) => {
    const res=await axiosInstance.get('/products/get-all-Product',{params})
    return res.data.data.products

};

export const getProductById = async (id) => {
    const res=await axiosInstance.get(`/products/get-ProductById/${id}`)
    return res.data

};

export const createProduct = async (productData) => {
    const res=await axiosInstance.post('/products/add-product',productData)
    return res.data

};


export const updateProduct = async ({ id, productData }) => {
     const res=await axiosInstance.put(`/products/update-product/${id}`,productData)
    return res.data

};


export const deleteProduct = async (id) => {
const res=await axiosInstance.delete(`/products/delete-product/${id}`)
    return res.data
};