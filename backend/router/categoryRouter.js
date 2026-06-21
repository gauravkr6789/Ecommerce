import express from 'express'

import {
    createCategory
    , getAllCategory, getSingleCategory, updateCategory, deleteCategory
} from '../controller/category.controller.js'

const categoryRouter=express.Router()

categoryRouter.post('/create',createCategory)
categoryRouter.get('/get-all',getAllCategory)
categoryRouter.get('/get-single',getSingleCategory)
categoryRouter.put('/update',updateCategory)
categoryRouter.delete('/delete',deleteCategory)

export default categoryRouter
