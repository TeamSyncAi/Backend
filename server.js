import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 3000;
const hostname = '127.0.0.1';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());
app.use('/api/user', userRouter);
app.use(notFoundError);
app.use(errorHandler);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
