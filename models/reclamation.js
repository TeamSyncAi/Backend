import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reclamationSchema = new Schema({
    title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  
  status: {
    type: String,
    enum: ['In progress', 'Accepted', 'Rejected'],
    default: 'In progress'
  },
  type: {
    type: String,
    enum: ['ideas and suggestions', 'reporting problems', 'task and project management','support requests','feedback','health'],
    required:false
  },
  /*responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur'
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  }*/
},
{
    timestamps : true
});

export default model("Reclamation", reclamationSchema);