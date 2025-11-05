import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Create a connection to SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_FILE
});

export default sequelize;
