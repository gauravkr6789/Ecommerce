import express from 'express'
import isAuthenticated from '../middleware/authmiddleware.js'
import { createOrder,verifyPayment,refundOrder,cancelOrder} from '../controller/payment.controller.js'
const paymentRouter=express.Router()

paymentRouter.post('/create-order',isAuthenticated,createOrder)
paymentRouter.post('/verify-payment',isAuthenticated,verifyPayment)
paymentRouter.post('/refund-payment/:orderId',isAuthenticated,refundOrder)
paymentRouter.delete('/cancel-payment/:orderId',isAuthenticated,cancelOrder)

export default paymentRouter
