import foodModel from "../models/foodModel.js";
import fs from 'fs/promises'; // Better fs module for async/await

// Add Food Item
const addFood = async (req, res) => {
    // 1. Check all required fields
    if (!req.file || !req.body.name || !req.body.description || !req.body.price || !req.body.category) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields are required: name, description, price, category, and image"
        });
    }

    // 2. Validate price is a number
    if (isNaN(req.body.price)) {
        return res.status(400).json({ 
            success: false, 
            message: "Price must be a number"
        });
    }

    try {
        // 3. Create new food item
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            category: req.body.category,
            image: req.file.filename
        });

        // 4. Save to database
        await food.save();
        
        // 5. Success response
        res.status(201).json({ 
            success: true, 
            message: "Food added successfully",
            data: food
        });
    } catch (error) {
        console.error("Add Food Error:", error);
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
        // 1. Get all foods sorted by newest first
        const foods = await foodModel.find({}).sort({ createdAt: -1 });
        
        // 2. Success response
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
        // 1. Find food item
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found"
            });
        }

        // 2. Delete image file
        const filePath = `uploads/${food.image}`;
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Image deleted: ${food.image}`);
        } catch (err) {
            console.log(`Image not found: ${food.image}`);
        }

        // 3. Delete from database
        await foodModel.findByIdAndDelete(req.body.id);
        
        // 4. Success response
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