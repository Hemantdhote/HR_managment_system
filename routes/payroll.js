const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Overtime = require('../models/Overtime');

// Index
router.get('/', async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employee');
    res.render('payroll/index', { payrolls });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Generate payroll form
router.get('/generate', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('payroll/generate', { employees });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Generate payroll
router.post('/generate', async (req, res) => {
  try {
    const { employee, month, year } = req.body;
    const employeeData = await Employee.findById(employee);
    const basicSalary = employeeData.salary;
    const deductions = 0; // You can implement a more complex deduction calculation
    const netSalary = basicSalary - deductions;

    const payroll = new Payroll({
      employee,
      month,
      year,
      basicSalary,
      deductions,
      netSalary
    });

    await payroll.save();
    res.redirect('/payroll');
  } catch (err) {
    res.status(400).send('Unable to generate payroll');
  }
});

module.exports = router;


