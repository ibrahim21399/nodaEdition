const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, unique: true },
  password: { type: String},
  registerationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('admins', adminSchema);
