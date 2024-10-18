const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser=require("cookie-parser");
const MongoStore = require('connect-mongo');
const employeeRoutes = require('./routes/employee');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const payrollRoutes = require('./routes/payroll');
const overtimeRoutes = require('./routes/overtime');
const documentRoutes = require('./routes/documents');

const app= express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0/hr_management_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Set the path to the layout file


// Routes
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/leaves', leaveRoutes);
app.use('/payroll', payrollRoutes);
app.use('/documents', documentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/overtime', overtimeRoutes);
app.use(cookieParser());
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0/hr_management_system' }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
  }));


  app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
  });
  

app.get('/home', (req, res) => {
    res.render('home', { title: 'Home', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

