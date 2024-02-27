import Projet from '../models/planningModel.js';
import { planifierTaches as planifierTachesModel } from '../models/iaService.js';

export async function planifierTaches(req, res) {
  try {
    console.log("Début de la fonction planifierTaches");
    const id_projet = req.params.id_projet;
    const trimmed_id_projet = id_projet.trim();

    console.log("ID du projet:", trimmed_id_projet);
    const projet = await Projet.findById(trimmed_id_projet);
    if (!projet) {
      console.log("Projet non trouvé");
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    const planification = await planifierTachesModel(projet);
    res.json(planification);
  } catch (err) {
    console.error("Erreur lors de la planification des tâches:", err.message);
    res.status(500).json({ message: err.message });
  }
};
