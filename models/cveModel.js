import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const CVE = sequelize.define("CVE", {
  cve_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
    allowNull: false
  },
  published_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reference_url: {
    type: DataTypes.STRING
  }
});

export default CVE;
