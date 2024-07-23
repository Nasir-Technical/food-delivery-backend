import foodModel from "../models/foodmodel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    console.log("image name se a rhi >>>>>>>", req.body.image);
    console.log("File name se a rhi >>>>>>>", req.file);

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// All food list
const listfood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        console.log("Received ID:", req.body.id); // Log the ID to ensure it's received correctly

        const food = await foodModel.findById(req.body.id);
        // if (!food) {
        //     return res.json({ success: false, message: "Food item not found" });
        // }

        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) console.log(err);
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listfood, removeFood };
