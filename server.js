import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import { fileURLToPath } from 'url';

// Routes imports remain same
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware (same as yours)
app.use(cors({ /* your config */ }));
app.use(express.json());

// Connect DB
connectDB();

// API Routes (same)
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Static files (modified for Vercel)
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admdist')));
app.use(express.static(path.join(__dirname, 'dist')));

// Route handlers (modified)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admdist', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Vercel-specific export
export default app;