import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import reclamationRoute from '../Backend/routes/reclamationRoute.js';
import reportRoute from '../Backend/routes/reportRoute.js'

const app = express() 
const hostname = '127.0.0.1'; 
const port=process.env.PORT || 9090 
const databaseName = 'TeamSyncIADB';

mongoose.set('debug',true);
mongoose.Promise = global.Promise;
mongoose
mongoose
  .connect(`mongodb://${hostname}:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/reclamation',reclamationRoute);
app.use('/report',reportRoute);



app.listen(port,()=>{
    console.log(`Server running ${hostname}:${port}`)
})


