import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct, getProductsById } from "../controllers/product.controller.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";


const router = express.Router();

router.get("/", authorizeRoles("admin", "user"), getProducts);

router.get("/:id", authorizeRoles("admin", "user"), getProductsById)

router.post("/", authorizeRoles("admin"), createProduct);

router.put("/:id", authorizeRoles("admin"), updateProduct);

router.delete("/:id", authorizeRoles("admin"), deleteProduct);

export default router;

// router is a object which contains relative routes in a combined manner.Organize routes by feature (products, users, orders, etc.).
// A dynamic value means a value that changes every time based on the request.
// : symbol is used specifically to define a dynamic variable in the URL.
// ":id" is a route parameter.
// 👉 Whatever comes in that part of the URL will be captured as a variable
// 👉 And stored inside req.params.id