import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import planningRoutes from './routes/planningRoute.js';




const app = express();


const port = process.env.PORT || 3015;
const databaseName = 'TeamSync';
const db_url = process.env.DB_URL || `mongodb://localhost:27017`;

mongoose.set('debug', true);

mongoose.Promise = global.Promise;
// Se connecter à MongoDB
mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`)
  .then(() => {
    
    console.log(`${db_url}/${databaseName}`);
  })
  .catch(err => {
    
    console.log(err);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



app.use('/planning', planningRoutes);



// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
  });
