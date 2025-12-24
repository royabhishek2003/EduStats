const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware,(req,res)=>{
    res.status(200).json({message:`Welcome to the home route, ${req.user.email}`});
});

module.exports = router;
