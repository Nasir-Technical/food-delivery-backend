// api/server.js
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import foodRouter from '../routes/foodRoute.js';
import userRouter from '../routes/userRoute.js';
import cartRouter from '../routes/cartRoute.js';
import orderRouter from '../routes/orderRoute.js';
import 'dotenv/config';

const app = express();

// CORS
app.use(cors({
  origin: [
    "https://food-delivery-frontend-eight-iota.vercel.app",
    "https://food-delivery-admin-ecru.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

// DB
await connectDB();   // <-- only ONE connection, here

// Middlewares
app.use(express.json());

// Routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/api/test', (req, res) => {
  res.send("Backend working!");
});

export default serverless(app);
