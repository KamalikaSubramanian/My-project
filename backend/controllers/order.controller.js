import mongoose from "mongoose";
import Order from "../models/order.model.js";
import { ObjectId } from "mongodb";
export const placeOrder = async (req, res) => {
    try {
        const { userId, products, address, paymentMethod } = req.body;

        console.log("Order being sent:", { userId, products, address, paymentMethod });

        if (!address || !address.name  || !address.street || !address.city || !address.state || !address.pincode || !address.phone) {
            return res.status(403).json({ success: false, message: "Details of address missing!" });
        }
 
        const totalAmount = products.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

        const order = new Order({
            userId: new ObjectId(userId),
            products: products.map(item => ({
                ...item,
                productId: new ObjectId(
                    item.productId?._id || item.productId 
                ),
            })),
            address,
            paymentMethod,
            totalAmount,
            status: "Processing",
        });


        await order.save();

        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "Error placing order", error: error.message });
    }
};


export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: orders })
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching orders", err });
    }
}
// A. Frontend sends product like this:
// { productId: { _id: "673..." } }
// Then item.productId?._id returns the value.

// B. Frontend sends product like this:
// { productId: "673..." }
// Then item.productId is used.

// || chooses whichever exists.