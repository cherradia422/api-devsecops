import express from "express";
import dotenv from "dotenv";
import sequelize from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import cveRoutes from "./routes/cveRoutes.js";

dotenv.config();
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", cveRoutes);
// Sync database
sequelize.sync().then(() => {
  console.log("✅ Database connected and tables created!");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
