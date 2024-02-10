import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './uploads/images');
  },

  filename: (request, file, callback) => {
    const newFileName = (+new Date()).toString() + path.extname(file.originalname);
    callback(null, newFileName);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;