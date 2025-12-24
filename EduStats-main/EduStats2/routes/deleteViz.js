const express = require("express");
const router = express.Router();
const Visualization = require("../models/vizModel.js");

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Incoming delete request for ID:", id);

    const visualization = await Visualization.findById(id);

    if (!visualization) {
      return res.status(404).json({
        success: false,
        message: "Visualization not found",
      });
    }

    await Visualization.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Visualization deleted successfully",
    });

  } catch (err) {
    console.error("Error deleting visualization:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;