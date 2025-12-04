import mongoose from "mongoose";
const productSubSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product referece is required"]
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Product name is required"],
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    type: {
        type: String,
        trim: true,
        default: "",
    },
    price: {
        type: Number,
        default: 1,
        required: [true, "Price is required"],
        min: [1, "Quantity must be at least 1"],
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    image: {
        type: String,
        default: "",
    },
    deliveryTime: {
        type: String,
        trim: true,
        default: "",
    },
}, { _id: false })

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // This links (references) the User model, so we know which user placed the order.
        required: [true, "User ID is required"]
    },
    products: [productSubSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Total amount cannot be negative"]
    },
    status: {
        type: String,
        default: "In cart"
    },
},
    { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;