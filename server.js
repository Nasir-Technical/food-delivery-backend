import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import 'dotenv/config'; // Load environment variables
import { fileURLToPath } from 'url';

// File and directory utilities for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://mr-food-del.vercel.app", // Allow these URLs
  allowedHeaders: 'Content-Type,Authorization',
}));

// DB connection
connectDB();

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve images from uploads folder
app.use('/images', express.static('uploads'));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, './dist')));

// // Serve static files from admin build
// app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));

// // Handle admin routes
// app.get('/admin/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
// });

// Handle frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
