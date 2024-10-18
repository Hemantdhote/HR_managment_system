const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Index - show all documents
router.get('/', async (req, res) => {
    try {
      const documents = await Document.find().populate('employee').lean();
      
      // Process documents to handle null employee
      const processedDocuments = documents.map(doc => ({
        ...doc,
        employee: doc.employee || null
      }));
  
      res.render('documents/index', { documents: processedDocuments });
    } catch (err) {
      console.error('Error fetching documents:', err);
      res.status(500).send('Server Error');
    }
  });
// Create form
router.get('/create', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('documents/create', { employees });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});



// Create document
router.post('/', upload.single('file'), async (req, res) => {
    try {
      const { employee, title, fileType } = req.body;
      const filePath = 'uploads/' + req.file.filename; // Store the relative path
  
      const document = new Document({
        employee,
        title,
        fileType,
        filePath
      });
  
      await document.save();
      res.redirect('/documents');
    } catch (err) {
      res.status(400).send('Unable to upload document');
    }
  });




  router.get('/:id/download', async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).send('Document not found');
      }
  
      const file = path.join(__dirname, '..', document.filePath);
      res.download(file, `${document.title}.${document.fileType}`);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

module.exports = router;