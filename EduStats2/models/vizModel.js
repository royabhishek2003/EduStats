const mongoose = require("mongoose");

const vizSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  vizName: {
    type: String,
    required: true,
  },
  stats: {
    mean: String,
    median: Number,
    mode: [Number],
    highest: Number,
    lowest: Number,
    stdDeviation: String,
    passCount: Number,
    failCount: Number,
  },

  studentResults: [
    {
      name: String,
      subject: String,
      marks: Number,
      totalMarks: Number,
      percentage: String,
      remarks: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Viz = mongoose.model("Viz", vizSchema);
module.exports = Viz;
