import express from "express";
import dotenv from "dotenv";
import sequelize from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import cveRoutes from "./routes/cveRoutes.js";

import User from "./models/userModel.js";     // ⬅ Add this
import bcrypt from "bcryptjs";                // ⬅ Add this
import jwt from "jsonwebtoken";               // ⬅ Add this

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", cveRoutes);

// ----------------------------
// AUTO-CREATE ADMIN IF MISSING
// ----------------------------
async function createDefaultAdmin() {
  try {
    const admin = await User.findOne({ where: { role: "admin" } });

    if (admin) {
      console.log("✔ Admin account already exists.");
      return;
    }

    console.log("⚠ No admin found. Creating default admin...");

    // Hash password
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create admin user
    const newAdmin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newAdmin.id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("===========================================");
    console.log("✔ Default admin created successfully!");
    console.log("username: admin");
    console.log("email: admin@example.com");
    console.log(`password: ${defaultPassword}`);
    console.log("\n⬇ Admin JWT Token:");
    console.log(token);
    console.log("===========================================\n");

  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
}

// ----------------------------
// SYNC DATABASE + START SERVER
// ----------------------------
sequelize.sync().then(async () => {
  console.log("✅ Database connected and tables created!!!");

  // Run admin creation
  await createDefaultAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
