import express from 'express'
import {getUserOrders,getOrderById,updateOrder } from '../controller/order.controller.js'
import isAuthenticated from '../middleware/authmiddleware.js'
const orderRouter=express.Router()

orderRouter.get('/get-order',isAuthenticated,getUserOrders)
orderRouter.get('/get-order/:id',isAuthenticated,getOrderById)
orderRouter.put('/update-order/:id',isAuthenticated,updateOrder)

export default orderRouter