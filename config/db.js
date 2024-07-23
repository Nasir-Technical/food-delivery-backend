import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Nasir:nasir789@cluster0.tulcevm.mongodb.net/food-del').then(()=>console.log("DB connected"));
}