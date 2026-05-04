const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  placed: { type: Boolean, required: true },
  company: { type: String },
  package: { type: Number }
});

module.exports = mongoose.model('Student', studentSchema);
