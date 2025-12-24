const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel.js");
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const visuals = await Visualization.find({ userEmail: email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      total: visuals.length,
      visualizations: visuals,
    });
  } catch (err) {
    console.error("Error fetching user visualizations:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

