import express from 'express'

import { razorpayWebhook } from '../controller/webhook.controller.js'
const webhookRouter=express.Router()

webhookRouter.post(
     "/",
  express.raw({
    type: "application/json",
  }),
  razorpayWebhook
)

export default webhookRouter