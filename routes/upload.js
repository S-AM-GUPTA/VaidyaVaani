const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up storage (this will save uploaded files to 'uploads/' directory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint to handle upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
