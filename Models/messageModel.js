const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teachers', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
  message: { type: String, required: true },
  sentDate: { type: Date, default: Date.now },
  isTeacher: { type: Boolean, required: true, default: false }

});

module.exports = mongoose.model('messages', messageSchema);
