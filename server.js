import express from 'express';

import morgan from 'morgan';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
const app = express();
const PORT = process.env.PORT || 3000;
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import reclamationRoute from '../Backend/routes/reclamationRoute.js';
import reportRoute from '../Backend/routes/reportRoute.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
dotenv.config();
app.use(morgan('dev'));
app.use(cors())
app.use(express.json());
app.use('/user', userRouter);
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.status(201).json({ message: 'successfully logged out ' })
})

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);

  // Send the image file
  res.sendFile(imagePath);
});
app.use(notFoundError);
app.use(errorHandler);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/reclamation',reclamationRoute);
app.use('/report',reportRoute);
mongoose.connect('mongodb+srv://yassineezzar:0000@cluster0.2aohdjo.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});

