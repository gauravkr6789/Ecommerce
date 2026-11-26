import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import http from "http";

import { fileURLToPath } from "url";
import connectDb from "./Database/dbConfig.js";
import passport from "./services/passport.js";

// Routers
import authRouter from "./router/userrouter.js";
import productRouter from "./router/productRouter.js";
import cartRouter from "./router/cartRouter.js";
import orderRouter from "./router/orderRouter.js";
import paymentRouter from "./router/paymentRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import webhookRouter from "./router/webhookRouter.js";
import couponRouter from "./router/couponRouter.js";
import Adminrouter from "./router/adminRouter.js";
import Reviewrouter from "./router/reviewRouter.js";
import wishlistrouter from "./router/wishlist.router.js";
import Addressrouter from "./router/address.router.js";
import invoiceRouter from "./router/invoice.router.js";
import deliveryRouter from "./router/delivery.router.js";
import refundRouter from "./router/refund.router.js";

// Socket.IO
import initializeSocket from "./socket/socket.js";

console.log("PORT :", process.env.PORT);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible inside controllers
app.set("io", io);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express CORS
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
  }),
);

// Webhook route
app.use("/api/webhook", webhookRouter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

console.log(__filename);
console.log(__dirname);

// API routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/admin", Adminrouter);
app.use("/api/review", Reviewrouter);
app.use("/api/wishlist", wishlistrouter);
app.use("/api/address", Addressrouter);
app.use("/api/invoice", invoiceRouter)
app.use("/api/delivery", deliveryRouter)
app.use("/api/refund", refundRouter)

// Start server
const startServer = async () => {
  try {
    await connectDb();

    const PORT = process.env.PORT || 3500;

    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.log("Server failed to start:", err.message);
  }
};

startServer();
