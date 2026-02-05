import express from 'express'
import {createOrder,getUserOrders,getOrderById,updateOrder,deleteOrder } from '../controller/order.controller.js'

const orderRouter=express.Router()
orderRouter.post('/create-order',createOrder)
orderRouter.get('/get-order',getUserOrders)
orderRouter.get('/get-order/:id',getOrderById)
orderRouter.put('/update-order/:id',updateOrder)
orderRouter.delete('/delete-order/:id',deleteOrder)

export default orderRouter