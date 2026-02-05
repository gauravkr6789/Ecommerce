import express from 'express'

import { AddToCart,getUserCart,updateCart,removeCart,clearCart } from '../controller/cart.controller.js'

const cartRouter=express.Router()

cartRouter.post('/add-cart',AddToCart)
cartRouter.get('get-user-cart',getUserCart)
cartRouter.put('/update-cart/:id',updateCart)
cartRouter.delete('/remove-cart/:id',removeCart)
cartRouter.delete('/clear-cart',clearCart)

export default cartRouter