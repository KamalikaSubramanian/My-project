import express from "express";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { addToCart,getCart, removeFromCart, updateCartQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", authorizeRoles("user"), addToCart);
router.get("/:userId",  authorizeRoles("user"), getCart);
router.patch("/", authorizeRoles("user"), updateCartQuantity);
router.delete("/",  authorizeRoles("user"), removeFromCart);

export default router;