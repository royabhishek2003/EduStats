const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel.js");

router.post("/", async (req, res) => {
  try {
    const { vizName, students, user } = req.body;

    
    if (!vizName || !students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    if (!user || !user.name || !user.email) {
      return res.status(400).json({ message: "User info missing!" });
    }

    
    const normalized = students.map((s) => ({
      name: s.name || "Unknown",
      subject: s.subject || "N/A",
      marks: Number(s.marks || 0),
      totalMarks: Number(s.totalMarks || 100),
      remarks: s.remarks || "",
      percentage: (
        ((Number(s.marks || 0)) / (Number(s.totalMarks || 100))) * 100
      ).toFixed(2),
    }));

    const marksList = normalized.map((s) => Number(s.marks));

    
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
      .filter((k) => freq[k] == maxFreq)
      .map(Number);

    
    const highest = Math.max(...marksList);
    const lowest = Math.min(...marksList);

    
    const variance =
      marksList.reduce((a, b) => a + (b - mean) ** 2, 0) / marksList.length;
    const stdDeviation = Math.sqrt(variance);

    
    const passCount = marksList.filter((m) => m >= 33).length;
    const failCount = marksList.length - passCount;

    
    const savedVisualization = await Visualization.create({
      vizName,
      userName: user.name,
      userEmail: user.email,
      totalStudents: students.length,
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
      message: "Manual visualization saved successfully",
      savedId: savedVisualization._id,
      vizName: savedVisualization.vizName,
      userName: savedVisualization.userName,
      userEmail: savedVisualization.userEmail,
      totalStudents: savedVisualization.totalStudents,
      stats: savedVisualization.stats,
      studentResults: savedVisualization.studentResults,
    });
  } catch (err) {
    console.error("Error in /manual-entry:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;