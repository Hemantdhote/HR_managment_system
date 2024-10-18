
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');


// Index route to display all attendance records
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('employee');
    res.render('attendance/index', { attendances });
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    res.status(500).send('Server Error');
  }
});
// Route to display the create attendance form
router.get('/create', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('attendance/create', { employees });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Server Error');
  }
});

// Create attendance record
router.post('/', async (req, res) => {
  const { employee, date, checkIn, checkOut, status } = req.body; // `employee` here is the employee ID

  try {
    // Validate that an employee ID was provided
    if (!employee) {
      return res.status(400).send('Employee ID is required');
    }

    // Find the employee by ID
    const presentEmployee = await Employee.findById(employee);
    if (!presentEmployee) {
      console.log(`Employee with ID ${employee} not found`);
      return res.status(404).send('Employee not found');
    }

    // Create a new attendance record for the employee
    const newAttendance = new Attendance({
      employee: presentEmployee._id,
      date: date || Date.now(),
      checkIn,
      checkOut,
      status,
    });

    // Save the new attendance record
    await newAttendance.save();
    console.log('New Attendance Record:', newAttendance);
    res.redirect('/attendance');
  } catch (err) {
    console.error('Error creating attendance:', err);
    res.status(500).send('Unable to process the request');
  }
});

module.exports = router;
