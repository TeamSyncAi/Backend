
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

export function getOnceReclamation(req, res) {
  Reclamation.findOne({ _id: req.params._id })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    })
}
export function getByType(req, res) {
  Reclamation.findOne({ type: req.params.type })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    })
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


