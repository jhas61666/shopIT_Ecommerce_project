import express from "express";
const app = express();
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from "cors";


// handle Uncaught exception 
process.on("uncaughtException", (err) => {
  console.log(`ERROR: $(err)`);
  console.log("Shuting down due to uncaught expection");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDatabase();



app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


//Import all routes 
import productRoutes from './routes/products.js';
import authRoutes from "./routes/auth.js"
import orderRoutes from "./routes/order.js"
import paymentRoutes from "./routes/payment.js"



app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);


// using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});