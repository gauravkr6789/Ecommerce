import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import { fileURLToPath } from 'url'
import connectDb from './Database/dbConfig.js'
import authRouter from './router/userrouter.js'
import productRouter from './router/productRouter.js'



console.log("PORT :",process.env.PORT)
const app=express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// parsing body
app.use(express.json())
//parsing form data 
app.use(express.urlencoded({extended:true}))
//static file
app.use('/uploads',express.static(path.join(__dirname, 'public', 'uploads')))


console.log(__filename)
console.log(__dirname)
//router
app.use('/api/auth',authRouter)
app.use('/api/products',productRouter)
//database connection

connectDb()
app.listen(process.env.PORT,()=>{
    console.log(`server running on port :${process.env.PORT}`)
})