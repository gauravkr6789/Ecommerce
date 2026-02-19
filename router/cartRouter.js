import express from 'express'

import { AddToCart,getUserCart,updateCart,removeCart,clearCart } from '../controller/cart.controller.js'
import isAuthenticated from '../utils/Token/authTokenMiddleware.js'
const cartRouter=express.Router()

cartRouter.post('/add-cart',isAuthenticated,AddToCart)
cartRouter.get('/get-user-cart',isAuthenticated,getUserCart)
cartRouter.put('/update-cart',isAuthenticated,updateCart)
cartRouter.delete('/remove-cart/:id',isAuthenticated,removeCart)
cartRouter.delete('/clear-cart',isAuthenticated,clearCart)

export default cartRouter