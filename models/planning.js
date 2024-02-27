import { Schema, model } from 'mongoose';

const tacheSchema = new Schema({
  nom: String,
  complexite: String,
  taille: String
});

const projetSchema = new Schema({
  nom: String,
  duree_par_jour: Number,
  taches: [tacheSchema]
});

export const Projet = model('Projet', projetSchema);
export default Projet;
