const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  registerationDate: { type: Date, default: Date.now },
  Active: { type: Boolean },
  // rating: {
  //   teacherId: { type: mongoose.Types.ObjectId, ref: "teachers" },
  //   rate: { type: Number, min: 1, max: 5 },
  //   feedback: { type: String },
  // },
});

module.exports = mongoose.model("students", studentSchema);
