import CVE from "../models/cveModel.js";

export const addCVE = async (req, res) => {
  try {
    const { cve_id, description, severity, reference_url } = req.body;

    const existing = await CVE.findOne({ where: { cve_id } });
    if (existing) {
      return res.status(400).json({ message: "CVE already exists" });
    }

    const cve = await CVE.create({ cve_id, description, severity, reference_url });
    res.status(201).json({ message: "CVE added successfully", cve });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listCVEs = async (req, res) => {
  try {
    const cves = await CVE.findAll();
    res.json(cves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCVE = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CVE.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "CVE not found" });
    }
    res.json({ message: "CVE deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
