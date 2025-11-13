import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only admins can register new users
router.post("/register", verifyToken, isAdmin, register);
router.post("/login", login);

export default router;