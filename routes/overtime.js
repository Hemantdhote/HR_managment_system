const express = require('express');
const router = express.Router();
const Overtime = require('../models/Overtime');
const Employee = require('../models/Employee');

// Index - show all overtime records
router.get('/', async (req, res) => {
    try {
      const overtimes = await Overtime.find().populate('employee').lean();
      
      // Process overtimes to handle null employee
      const processedOvertimes = overtimes.map(overtime => ({
        ...overtime,
        employee: overtime.employee || null
      }));
  
      res.render('overtime/index', { overtimes: processedOvertimes, title: 'Overtime Records' });
    } catch (err) {
      console.error('Error fetching overtime records:', err);
      res.status(500).send('Server Error');
    }
  });

// Create form
router.get('/create', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('overtime/create', { employees, title: 'Record Overtime' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create overtime record
router.post('/', async (req, res) => {
  try {
    const overtime = new Overtime(req.body);
    await overtime.save();
    res.redirect('/overtime');
  } catch (err) {
    res.status(400).send('Unable to create overtime record');
  }
});

// Update overtime status
router.post('/:id/update-status', async (req, res) => {
  try {
    const { status } = req.body;
    await Overtime.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/overtime');
  } catch (err) {
    res.status(400).send('Unable to update overtime status');
  }
});

module.exports = router;