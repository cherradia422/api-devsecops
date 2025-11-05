import express from "express";
import { addCVE, listCVEs, deleteCVE } from "../controllers/cveController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { importCVEsFromNVD } from "../controllers/nvdImportController.js";

const router = express.Router();

// 👇 Require login for all CVE routes
router.get("/cves", verifyToken, listCVEs);
router.post("/cves", verifyToken, isAdmin, addCVE);
router.delete("/cves/:id", verifyToken, isAdmin, deleteCVE);
//fetch cve from nvd.nist.gov
router.post("/cves/import", verifyToken, isAdmin, importCVEsFromNVD);


export default router;
