
const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Index
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee');
    res.render('leaves/index', { leaves });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create form
router.get('/create', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('leaves/create', { employees });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create leave
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.redirect('/leaves');
  } catch (err) {
    res.status(400).send('Unable to create leave record');
  }
});

module.exports = router;