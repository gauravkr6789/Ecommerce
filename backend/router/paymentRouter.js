import express from 'express'
import isAuthenticated from '../utils/Token/authTokenMiddleware.js'
import { payOrder,verifyPayment,refundOrder,cancelOrder,createPaymentLink } from '../controller/payment.controller.js'
const paymentRouter=express.Router()

paymentRouter.post('/pay',isAuthenticated,payOrder)
paymentRouter.post('/verify-payment',isAuthenticated,verifyPayment)
paymentRouter.post('/refund-payment/:orderId',isAuthenticated,refundOrder)
paymentRouter.post('/payment-link',isAuthenticated,createPaymentLink)
paymentRouter.delete('/cancel-payment/:orderId',isAuthenticated,cancelOrder)

export default paymentRouter
