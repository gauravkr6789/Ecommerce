import express from 'express'

import {
   addCategory
    , getAllCategory,  getCategoryById, updateCategory, deleteCategory
} from '../controller/category.controller.js'

const categoryRouter=express.Router()

categoryRouter.post('/create',addCategory)
categoryRouter.get('/get-all',getAllCategory)
categoryRouter.get('/get-single/:id', getCategoryById)
categoryRouter.put('/update/:id',updateCategory)
categoryRouter.delete('/delete/:id',deleteCategory)

export default categoryRouter
