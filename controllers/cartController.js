import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        let user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        user.cartData = cartData;
        await user.save();

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log("Error adding to cart:", error);
        res.json({ success: false, message: "Error", error: error.message });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        let user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1;
            } else {
                delete cartData[itemId];
            }
        }

        user.cartData = cartData;
        await user.save();

        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log("Error removing from cart:", error);
        res.json({ success: false, message: "Error", error: error.message });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        let user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.log("Error fetching cart data:", error);
        res.json({ success: false, message: "Error", error: error.message });
    }
};

export { addToCart, removeFromCart, getCart };
