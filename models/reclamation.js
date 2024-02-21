const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['En attente', 'En cours', 'Résolue'],
    default: 'En attente'
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur'
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  }
});

const Reclamation = mongoose.model('Reclamation', reclamationSchema);

module.exports = Reclamation;
