const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel.js");
router.get("/:id", async (req, res) => {
    try {
      console.log("Incoming request for ID:", req.params.id);
    const { id } = req.params;
    const visualization = await Visualization.findById(id);

    if (!visualization) {
      return res.status(404).json({
        success: false,
        message: "Visualization not found",
      });
    }

    return res.status(200).json({
      success: true,
      visualization,
    });

  } catch (err) {
    console.error("Error fetching specific visualization:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
