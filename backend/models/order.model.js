import mongoose from "mongoose";

const subProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
  },
  deliveryTime: String,
  image: String,
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [subProductSchema],
      required: true,
      validate: [(val) => val.length > 0, "Order must have at least one product"],
    },
    address: {
      type: addressSchema,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "GPay"],
      default: "COD",
    },
    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

