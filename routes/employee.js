const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Index
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('employees/index',  { title: 'Employees', employees });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create form
router.get('/create', (req, res) => {
  res.render('employees/create');
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.redirect('/employees');
  } catch (err) {
    res.status(400).send('Unable to create employee');
  }
});

// View employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('employees/view', { employee });
  } catch (err) {
    res.status(404).send('Employee not found');
  }
});

// Edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('employees/edit', { employee });
  } catch (err) {
    res.status(404).send('Employee not found');
  }
});

// Update employee
router.post('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/employees');
  } catch (err) {
    res.status(400).send('Unable to update employee');
  }
});

// Delete employee
router.post('/:id/delete', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
  } catch (err) {
    res.status(400).send('Unable to delete employee');
  }
});

module.exports = router;