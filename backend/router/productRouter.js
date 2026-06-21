import express from 'express'
import { addProduct,getAllProduct,getProductById,updateProduct,deleteProduct } from '../controller/product.controller.js'
import { upload } from '../services/multer.middleware.js'
import isAuthenticated from '../middleware/authmiddleware.js'
import isAdmin from '../middleware/adminMiddleware.js'
const productRouter=express.Router()
productRouter.post('/add-product',isAuthenticated,isAdmin,upload.array('images',2),addProduct)
productRouter.get('/get-all-Product',getAllProduct)
productRouter.get(`/get-ProductById/:id`,getProductById)
productRouter.put('/update-product/:id',isAuthenticated,isAdmin,upload.array('images',2),updateProduct)
productRouter.delete('/delete-product/:id',isAuthenticated,isAdmin,deleteProduct)

export default productRouter