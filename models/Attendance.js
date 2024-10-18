
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now // Default to current date if not provided
  },
  checkIn: { 
    type: String, // Changed from Date to String
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2}:\d{2}$/.test(v); // Validate "HH:mm" format
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  checkOut: { 
    type: String, // Changed from Date to String
    validate: {
      validator: function(v) {
        return /^\d{2}:\d{2}$/.test(v); // Validate "HH:mm" format if provided
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'half-day'], 
    default: 'present' 
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
