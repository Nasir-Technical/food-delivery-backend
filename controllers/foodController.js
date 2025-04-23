import foodModel from "../models/foodModel.js";
import fs from 'fs/promises';
import mongoose from "mongoose";

// Add Food Item
const addFood = async (req, res) => {
    try {
        // Validate all required fields
        if (!req.file || !req.body.name || !req.body.description || !req.body.price || !req.body.category) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required: name, description, price, category, and image"
            });
        }

        // Validate price is a positive number
        const price = parseFloat(req.body.price);
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Price must be a positive number"
            });
        }

        // Create new food item
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: price,
            category: req.body.category,
            image: req.file.filename
        });

        await food.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Food added successfully",
            data: food
        });
    } catch (error) {
        console.error("Add Food Error:", error);
        
        // Delete uploaded file if saving to DB failed
        if (req.file) {
            await fs.unlink(`uploads/${req.file.filename}`).catch(err => console.error("Failed to delete uploaded file:", err));
        }

        res.status(500).json({ 
            success: false, 
            message: "Failed to add food",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// List All Food Items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}).sort({ createdAt: -1 });
        res.json({ 
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        console.error("List Food Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to get food list",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Remove Food Item
const removeFood = async (req, res) => {
    try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid food ID format"
            });
        }

        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found"
            });
        }

        // Delete image file if exists
        const filePath = `uploads/${food.image}`;
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Deleted image: ${food.image}`);
        } catch (err) {
            console.log(`Image not found: ${food.image}`);
        }

        await foodModel.findByIdAndDelete(req.params.id);
        
        res.json({ 
            success: true, 
            message: "Food removed successfully"
        });
    } catch (error) {
        console.error("Remove Food Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to remove food",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export { addFood, listFood, removeFood };