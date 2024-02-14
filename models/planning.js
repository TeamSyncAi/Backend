// Importer le module mongoose pour la gestion de la base de données
import mongoose from 'mongoose';

const planningSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  constraints: {
    type: Array,
    required: true
  },
  priorities: {
    type: Array,
    required: true
  }
});

// Créer le modèle de planification à partir du schéma
const Planning = mongoose.model('Planning', planningSchema);



// Fonction pour trouver un planning par son identifiant
export function findById(id, callback) {
  Planning.findById(id, callback);
}

// Fonction pour trouver et supprimer un planning par son identifiant
export function findByIdAndDelete(id, callback) {
  Planning.findByIdAndDelete(id, callback);
}

// Exporter le modèle de planification
export default Planning;
