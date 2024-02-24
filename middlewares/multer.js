// Import required modules
import express from 'express';
import multer from 'multer';

// Create an Express app
const app = express();

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdfFile-' + uniqueSuffix + '.' + fileExt);
  }
});

// Multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  const pdfFile = req.file;

  // Check if PDF file exists
  if (!pdfFile) {
    return res.status(400).json({ message: 'No PDF file uploaded' });
  }

  // Process the uploaded PDF file (e.g., save it to a database, extract information)
  // Add your PDF processing logic here

  res.status(200).json({ message: 'PDF file uploaded successfully', filename: pdfFile.filename });
});





export default upload ; 