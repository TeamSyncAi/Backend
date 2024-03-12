
import Reclamation from '../models/reclamation.js'; 


export function addReclamation(req, res) {
  const statutValue = req.body.statut || 'In progress';
  const typesValue = req.body.type
  const date = new Date(req.body.date);

    Reclamation.create({
    title:req.body.title,
    description:req.body.description,
    status:statutValue,
    date:date,
    type:typesValue,
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
  Reclamation.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteAllReclamation(req, res) {
  Reclamation.deleteMany({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


const validTypes = ['ideas and suggestions', 'reporting problems', 'task and project management', 'support requests', 'feedback', 'health'];

export function getByType(req, res) {
  const type = req.params.type.toLowerCase();
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type invalide' });
  }

  Reclamation.find({ type: type })
    .then((reclamations) => {
      console.log("Fetched reclamations:", reclamations); 
      res.status(200).json(reclamations);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}




export function deleteOnceReclamation(req, res) {
  Reclamation.findOneAndDelete({ _id: req.params._id })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


export function UpdateReclamation(req, res) {
  const { _id } = req.params;
  const updatedInfoData = req.body;
  
    
  Reclamation.findByIdAndUpdate(_id, updatedInfoData )
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


