import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';


// File and directory utilities for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// // DB connection
// connectDB();

// App initialize
const app = express();
console.log("🚀 Server Starting... Vercel Fix v2");

// CORS FIX (Vercel Serverless Compatible)
const corsOptions = {
  origin: [
    "https://food-delivery-frontend-eight-iota.vercel.app",
    "https://food-delivery-admin-ecru.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // <-- VERY IMPORTANT

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// Health check
app.get("/api/test", (req, res) => {
  res.type('text');
  res.send("Backend is working!");
});

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connect Error:", error);
        res.status(500).json({ success: false, message: "Database Connection Failed" });
    }
});

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);



// Serve images from uploads folder
app.use('/images', express.static('uploads'));

// // Serve static files from admin build
// app.use('/admin', express.static(path.join(__dirname, './admdist')));

// // Handle admin routes
// app.get('/admin/*splat', (req, res) => {
//   res.sendFile(path.join(__dirname, './admdist', 'index.html'));
// });

// // Serve static files from frontend build
// app.use(express.static(path.join(__dirname, './dist')));

// // Handle frontend routes
// app.get('/*splat', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'));
// });

// Start server
// Start server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}

export default app;