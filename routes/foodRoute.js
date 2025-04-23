import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Configuration
const storage = process.env.NODE_ENV === "production" 
  ? multer.memoryStorage() // For Vercel (no disk writes)
  : multer.diskStorage({   // For local development
      destination: "uploads",
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
      }
    });

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/:id", removeFood); // Changed to DELETE and simplified path

export default foodRouter;