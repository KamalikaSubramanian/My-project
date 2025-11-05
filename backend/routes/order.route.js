import express from "express";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getOrdersByUser, placeOrder } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/",authorizeRoles("user"),placeOrder);
router.get("/:userId",authorizeRoles("user"),getOrdersByUser);

export default router;