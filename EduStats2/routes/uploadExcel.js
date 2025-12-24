const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel.js");

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    const { students, vizName, user } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or missing students data" });
    }

    if (!user || !user.name || !user.email) {
      return res.status(400).json({ message: "User info missing!" });
    }

    
    const normalized = students.map((s) => {
      return {
        name: s.name || s.Name || "Unknown",
        subject: s.subject || s.Subject || "N/A",
        marks: Number(s.marks || s.Marks || 0),
        totalMarks: Number(s.totalMarks || s.TotalMarks || 100),
        remarks: s.remarks || s.Remarks || "N/A",
      };
    });

    const marksList = normalized.map((s) => s.marks);
    const totalMarks = normalized[0]?.totalMarks || 100;
    
    const mean = marksList.reduce((a, b) => a + b, 0) / marksList.length;

    
    const sorted = [...marksList].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid] + sorted[mid - 1]) / 2
        : sorted[mid];

    
    const freq = {};
    marksList.forEach((m) => (freq[m] = (freq[m] || 0) + 1));
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.keys(freq)
      .filter((k) => freq[k] === maxFreq)
      .map(Number);

    
    const highest = Math.max(...marksList);
    const lowest = Math.min(...marksList);

   
    const variance =
      marksList.reduce((a, b) => a + (b - mean) ** 2, 0) / marksList.length;
    const stdDeviation = Math.sqrt(variance);

    const passCount = normalized.filter(
      (s) => s.marks >= 0.3333 * totalMarks
    ).length;

    const failCount = normalized.length - passCount;

    
    const savedVisualization = await Visualization.create({
      vizName: vizName || "Excel Upload Visualization",
      userName: user.name,
      userEmail: user.email,
      totalStudents: normalized.length,
      stats: {
        mean: mean.toFixed(2),
        median,
        mode,
        highest,
        lowest,
        stdDeviation: stdDeviation.toFixed(2),
        passCount,
        failCount,
      },
      studentResults: normalized,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Visualization saved successfully",
      savedId: savedVisualization._id,
      vizName: savedVisualization.vizName,
      userName: savedVisualization.userName,
      userEmail: savedVisualization.userEmail,
      totalStudents: normalized.length,
      stats: savedVisualization.stats,
      studentResults: normalized,
    });
  } catch (err) {
    console.error("❌ Error in /upload-excel:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
