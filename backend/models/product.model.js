import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		type:{
			type:String,
			required:true,
		},
		image: {
			type: String,
			required: true,
		},
		description:{
			type:String,
			required: true,
		},
		deliveryTime:{
			type:String,
			required: true,
		}
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

const Product = mongoose.model("Product", productSchema);
// mongoose.model(modelName, schema).Mongoose will automatically create a collection name in MongoDB by pluralizing and lowercasing it(products)."Product" → products collection.
// A Model is a class with which you can create, query, update, and delete documents in a MongoDB collection.
// productschema - It describes the shape of the documents in the products collection (fields, types, validations, defaults, etc.).

export default Product;

// mongoose schema =>
// First Argument → Schema Definition (fields) - What properties your document will have.
// Second Argument → Schema Options (configuration) - How the schema should behave.