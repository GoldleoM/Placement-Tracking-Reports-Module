const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    avgPackage: { type: Number, required: true },
    placedCount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
