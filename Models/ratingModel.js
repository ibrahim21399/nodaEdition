const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teachers",
    required: true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "students",
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ratings", ratingSchema);
