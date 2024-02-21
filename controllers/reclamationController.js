
import reclamation from '../models/reclamation.js';
import Reclamation from '../models/reclamation.js'; 


export function addReclamation(req, res) {
  const statutValue = req.body.statut || 'En attente';
  
  Reclamation.create({
    titre:req.body.titre,
    description:req.body.description,
    statut:statutValue,
    /*responsable,
    utilisateur,*/
    
    
  })
  .then((newReclamation) => {
    res.status(200).json(newReclamation);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
}

export function getAllReclamation(req, res) {
  reclamation.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteAllReclamation(req, res) {
  reclamation.deleteMany({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


