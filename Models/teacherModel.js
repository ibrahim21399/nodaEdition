const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: { type: String },
  password: { type: String },
  phone: { type: String },
  pricePerHour: { type: Number },
  experienceYears: { type: Number },
  Latitude: { type: Number },
  Longitude: { type: Number },
  field: { type: String },
  // rating: { type: Number, default: 0 },
  registerationDate: { type: Date, default: Date.now },
  Active: { type: Boolean },
  AcceptanceDate: { type: Date },
  studentEnrolled: [{ type: mongoose.Types.ObjectId, ref: "students" }],
  averageRating: {
    type: Number,
    default: null,
  },
});

// teacherSchema.virtual("averageRating").get(function () {
//   if (this.studentEnrolled.length === 0) {
//     return null; // Return null if there are no enrolled students
//   }
//   const totalRating = this.studentEnrolled.reduce((total, student) => {
//     if (student.rating && student.rating.rate) {
//       return total + Number(student.rating.rate);
//     } else {
//       return total;
//     }
//   }, 0);
//   const numRatings = this.studentEnrolled.filter(
//     (student) => student.rating && student.rating.rate
//   ).length;
//   return numRatings > 0 ? totalRating / numRatings : null; // Return null if there are no ratings
// });

// Calculate the average rating for a teacher
// teacherSchema.methods.calculateAverageRating = function () {
//   if (this.studentEnrolled.length === 0) {
//     return null; // Return null if there are no enrolled students
//   }
//   const totalRating = this.studentEnrolled.reduce((total, student) => {
//     if (student.rating && student.rating.rate) {
//       return total + Number(student.rating.rate);
//     } else {
//       return total;
//     }
//   }, 0);
//   const numRatings = this.studentEnrolled.filter(
//     (student) => student.rating && student.rating.rate
//   ).length;
//   this.averageRating = numRatings > 0 ? totalRating / numRatings : null; // Set averageRating to null if there are no ratings
// };

module.exports = mongoose.model("teachers", teacherSchema);
