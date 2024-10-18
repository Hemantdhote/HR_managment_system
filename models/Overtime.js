const mongoose = require('mongoose');

const OvertimeSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  rate: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Overtime', OvertimeSchema);