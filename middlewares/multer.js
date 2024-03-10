
import express from 'express';
import multer from 'multer';


const app = express();


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

const upload = multer({ storage: storage });


app.post('/upload', upload.single('pdfFile'), (req, res) => {
  const pdfFile = req.file;

  if (!pdfFile) {
    return res.status(400).json({ message: 'No PDF file uploaded' });
  }

  

  res.status(200).json({ message: 'PDF file uploaded successfully', filename: pdfFile.filename });
});





export default upload ; 