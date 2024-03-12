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
  description: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    enum: ['In progress', 'Accepted', 'Rejected'],
    default: 'En attente'
  },
  type: {
    type: String,
    enum: ['ideas and suggestions', 'Reporting problems', 'Rejected'],
    
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