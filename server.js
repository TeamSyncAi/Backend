import express from 'express';
import mongoose from 'mongoose';
import errorHandlingMiddleware from './middleware/errorHandlingMiddleware.js';
import { createProject } from './routes/projectRoutes.js';
import moduleRoute from './routes/moduleRoute.js'; 


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use('/projects', createProject);
app.use('/modules', moduleRoute);



app.use(errorHandlingMiddleware);

mongoose.connect('mongodb+srv://hama:sZKLggJMv5aSYQCI@cluster0.xsxxjn5.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




