const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    res.json({
      status: true,
      user
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;