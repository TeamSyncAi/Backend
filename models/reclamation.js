import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reclamationSchema = new Schema({
    titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  statut: {
    type: String,
    enum: ['En attente', 'En cours', 'Résolue'],
    default: 'En attente'
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

export default model("reclamation", reclamationSchema);