import axios from "axios";
import CVE from "../models/cveModel.js";

export const importCVEsFromNVD = async (req, res) => {
  try {
    console.log("Fetching CVEs from NVD...");

    const url = "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100";
    const response = await axios.get(url);
    const cves = response.data.vulnerabilities;

    let added = 0;

    for (const item of cves) {
      const cveData = item.cve;
      const cveId = cveData.id;
      const description = cveData.descriptions?.[0]?.value || "No description provided";
      const severity = cveData.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || "UNKNOWN";
      const reference = cveData.references?.[0]?.url || "";

      // Skip if already exists
      const exists = await CVE.findOne({ where: { cve_id: cveId } });
      if (exists) continue;

      // Save to your DB
      await CVE.create({
        cve_id: cveId,
        description,
        severity,
        reference_url: reference
      });

      added++;
    }

    res.json({ message: `Imported ${added} new CVEs from NVD.` });
  } catch (error) {
    console.error("Import error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
