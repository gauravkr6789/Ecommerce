import "dotenv/config";
import express from 'express';
import path from 'path';

import cors from 'cors';
import session from 'express-session';
import passport from './services/passport.js';
import { fileURLToPath } from 'url';
import connectDb from './Database/dbConfig.js';
import authRouter from './router/userrouter.js';
import productRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';
import orderRouter from './router/orderRouter.js';
import paymentRouter from './router/paymentRouter.js';
import categoryRouter from './router/categoryRouter.js';
import webhookRouter from "./router/webhookRouter.js";
import couponRouter from "./router/couponRouter.js";
import Adminrouter from "./router/adminRouter.js";
import Reviewrouter from "./router/reviewRouter.js";
import wishlistrouter from "./router/wishlist.router.js";
import Addressrouter from "./router/address.router.js";




console.log("PORT :", process.env.PORT);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIEN_Secret:", process.env.GOOGLE_CLIENT_SECRET); // check if loaded

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecommerce-delta-azure.vercel.app",
    ],
    credentials: true,
  })
);

app.use(
  "/api/webhook",
  webhookRouter
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session()); 

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

console.log(__filename);
console.log(__dirname);

app.use('/api/auth', authRouter);
app.use('/api/categories',categoryRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/coupon',couponRouter)
app.use('/api/admin',Adminrouter)
app.use('/api/review',Reviewrouter)
app.use('/api/wishlist',wishlistrouter)
app.use('/api/address',Addressrouter)


const startServer = async () => {
  try {
    await connectDb();

    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

  } catch (err) {
    console.log("Server failed to start:", err.message);
  }
};

startServer();