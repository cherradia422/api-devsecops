// server.js  (ESM) — intentionally insecure for SonarQube testing
import express from "express";
import dotenv from "dotenv";
import { exec } from "child_process";               // ❌ used unsafely below
import sequelize from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import cveRoutes from "./routes/cveRoutes.js";

dotenv.config();
const app = express();
// Middleware to parse JSON body
app.use(express.json());

// ------------------------------------------------------------------
// INTENTIONAL VULNERABILITIES (for SonarQube testing) — remove after
// ------------------------------------------------------------------

// ❌ 1) Hardcoded secret in source code
// SonarQube will flag this as sensitive information in code.
const INTENTIONAL_HARDCODED_SECRET = "veryBadHardcodedSecret_123!";

// ❌ 2) Command injection risk: using unsanitized user input in exec()
// Adds a /ping endpoint that runs `ping` with user-supplied input.
// DO NOT use in production — an attacker could craft input to run arbitrary commands.
app.get("/debug/ping", (req, res) => {
  const ip = req.query.ip || "127.0.0.1";
  // Intentionally insecure:
  exec(`ping -c 2 ${ip}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send("Error");
    }
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(stdout);
  });
});

// ❌ 3) SQL injection risk with raw string concatenation using Sequelize
// Adds a /debug/find-user?username=... endpoint that performs a raw query.
// DO NOT use string concatenation for queries in production.
app.get("/debug/find-user", async (req, res) => {
  try {
    const username = req.query.username || "anonymous";
    // Intentionally insecure raw query:
    const sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1;`;
    const [results] = await sequelize.query(sql); // Sequelize raw query
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "query error" });
  }
});
// ------------------------------------------------------------------
// End intentional vulnerabilities
// ------------------------------------------------------------------

// Routes
app.use("/api", authRoutes);
app.use("/api", cveRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log("✅ Database connected and tables created!");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
