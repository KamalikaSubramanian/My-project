import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        console.log("Incoming addToCart request:", req.body);

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ success: false, message: "Invalid userId" });
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ success: false, message: "Invalid productId" });
        const product = await Product.findById(productId);

        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [], totalAmount: 0 });

        }
        const existingItem = cart.products.find(
            (item) => item.productId.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.products.push({
                productId: product._id,
                name: product.name,
                description: product.description,
                type: product.type,
                price: product.price,
                quantity: product.quantity,
                image: product.image || "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D",
                deliveryTime: product.deliveryTime || "2-4 days",
            });

        }
        cart.totalAmount = cart.products.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0);
        cart.status = "In cart";

        console.log({ cart });


        await cart.save();
        console.log({ product });
        return res.status(200).json({ success: true, data: cart });
    }
    catch (err) {
        console.error("Add to cart error:", err);
        return res.status(500).json({ success: false, message: "Error adding to cart" });
    }
}

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ success: false, message: "Invalid userId" });
        let cart = await Cart.findOne({ userId }).populate("products.productId");
        // POPULATE -  "Go to the products array → find productId →
        // look up that ID in the referenced collection →
        // bring the full product document instead of the ID."
        if (!cart) {
            cart = await Cart.create({ userId, products: [], totalAmount: 0 });
        }
        return res.status(200).json({ success: true, data: cart });
    }
    catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ success: false, message: "Error fetching cart" });
    }
}

export const updateCartQuantity = async (req, res) => {
    try {
        const { userId, productId, action } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ success: false, message: "Invalid UserId" });
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ success: false, message: "Invalid productId" });

        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.products.find((p) => p.productId.toString() === productId);

        if (!item)
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        if (action === "increase")
            item.quantity += 1

        else if (action === "decrease") {
            if (item.quantity > 1)
                item.quantity -= 1
            else // When quantity is 1
                cart.products = cart.products.filter((p) => p.productId.toString() !== productId)
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid action type" });
        }
        cart.totalAmount = cart.products.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0);
        await cart.save();
        const updatedCart = await Cart.findById(cart._id)
            .populate("products.productId");
        return res.status(200).json({ success: true, data: updatedCart });
    }
    catch (err) {
        console.error("Error updating cart quantity:", err);
        return res.status(500).json({ success: false, message: "Error updating cart" });
    }
}
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ success: false, message: "Invalid userId" });

        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ success: false, message: "Invalid productId" });

        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(404).json({ success: false, message: "Cart not found" });

        cart.products = cart.products.filter(
            (item) => item.productId.toString() !== productId
        );

        cart.totalAmount = cart.products.reduce(
            (sum, p) => sum + (p.price * p.quantity),
            0
        );

        await cart.save();

        const updatedCart = await Cart.findOne({ userId }).populate("products.productId");

        return res.status(200).json({ success: true, data: updatedCart });
    }
    catch (err) {
        console.error("Error removing product:", err);
        return res.status(500).json({ success: false, message: "Error removing product from cart" });
    }
};

// populate() takes a string path that represents the schema field to be populated, so nested paths like products.productId must be passed as a string.
