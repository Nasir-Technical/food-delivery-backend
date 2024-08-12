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

// CORS configuration
app.use(cors({
  origin: ['https://food-delivery-backend-eta.vercel.app', 'https://mr-foodi.vercel.app'], // Yahan multiple origins ko allow karein    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// DB connection
connectDB();

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve images from uploads folder
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static files from admin build if needed
// app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));

// Handle admin routes if needed
// app.get('/admin/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
// });

// Handle frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
