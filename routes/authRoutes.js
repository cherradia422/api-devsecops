import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();
const router = express.Router();

/**
 * Route: POST /api/register
 * Allows:
 *  - Admin users to register new users (normal behavior)
 *  - A bootstrap token (generated on first startup) to register the very first admin
 */
router.post("/register", async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Require token in header
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await User.findAll();

    // Case 1: Bootstrap token (only valid if no users exist yet)
    const isBootstrap = decoded.role === "bootstrap" && users.length === 0;

    // Case 2: Normal admin token
    const isAdmin = decoded.role === "admin";

    if (isBootstrap || isAdmin) {
      return register(req, res);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Normal login route
router.post("/login", login);

export default router;
