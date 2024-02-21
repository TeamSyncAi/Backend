
import Reclamation from '../models/reclamation'; 


export function addReclamation(req, res) {
  const { titre, description/*,responsable, utilisateur*/ } = req.body;
  const statut = req.body.statut || 'En attente'; 
  const date = req.body.date || new Date(); 
  
  Reclamation.create({
    titre,
    description,
    statut,
    /*responsable,
    utilisateur,*/
    date
  })
  .then((newReclamation) => {
    res.status(200).json(newReclamation);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
}

