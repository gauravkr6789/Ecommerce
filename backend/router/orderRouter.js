import express from 'express'
import {createOrder,getUserOrders,getOrderById,updateOrder,deleteOrder } from '../controller/order.controller.js'
import isAuthenticated from '../utils/Token/authTokenMiddleware.js'
const orderRouter=express.Router()
orderRouter.post('/create-order',isAuthenticated,createOrder)
orderRouter.get('/get-order',isAuthenticated,getUserOrders)
orderRouter.get('/get-order/:id',isAuthenticated,getOrderById)
orderRouter.put('/update-order/:id',isAuthenticated,updateOrder)
orderRouter.delete('/delete-order/:id',isAuthenticated,deleteOrder)

export default orderRouter