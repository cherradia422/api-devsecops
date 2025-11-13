import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import sequelize from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import cveRoutes from "./routes/cveRoutes.js";
import User from "./models/userModel.js";

dotenv.config();

const app = express();
app.use(express.json());

// === ROUTES ===
app.use("/api", authRoutes);
app.use("/api", cveRoutes);

// === BOOTSTRAP TOKEN FUNCTION ===
async function checkFirstRun() {
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      const secret = process.env.JWT_SECRET || "supersecretkey";

      // Generate one-time bootstrap token (valid 1h)
      const bootstrapToken = jwt.sign(
        { role: "bootstrap", purpose: "first_admin" },
        secret,
        { expiresIn: "1h" }
      );

      console.log("⚠️  No users found in database.");
      console.log("🔐  Use this temporary token to register the first admin:");
      console.log(`👉  Authorization: Bearer ${bootstrapToken}`);
      console.log("⏳  Token valid for 1 hour only.\n");

      // === Save token to a local file ===
      fs.writeFileSync("bootstrap_token.txt", bootstrapToken);
      console.log("📝 Token also saved in 'bootstrap_token.txt'\n");
    } else {
      console.log("✅ Admin(s) already exist — bootstrap token not generated.");
    }
  } catch (error) {
    console.error("❌ Error during first-run check:", error);
  }
}

// === INIT DATABASE AND START SERVER ===
sequelize.sync().then(async () => {
  console.log("✅ Database connected and tables created!");

  // Run bootstrap check before server start
  await checkFirstRun();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
