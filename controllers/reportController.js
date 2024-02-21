import Report from '../models/report.js'; 


//crud
export function addReport(req, res) {
  const { type, titre, description, dateDebut, dateFin, createur, donnees } = req.body;

  if (!['Rapport de productivité', 'Planification vs Réalisation', 'Autre'].includes(type)) {
    return res.status(400).json({ error: "Type de rapport invalide" });
  }

  Report.create({
    type,
    titre,
    description,
    dateDebut,
    dateFin,
    createur,
    donnees
  })
  .then((newReport) => {
    res.status(200).json(newReport);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
}

export function getAllReport(req, res) {
    Report.find({})
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  export function deleteAllReport(req, res) {
    Report.deleteMany({})
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  export function getOnceReport(req, res) {
    Report.findOne({ _id: req.params._id })
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      })
  }

  export function deleteOnceReport(req, res) {
    Report.findOneAndDelete({ _id: req.params._id })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  
  
  export function UpdateReport(req, res) {
    const { _id } = req.params;
    const updatedInfoData = req.body;
    
      
    Report.findByIdAndUpdate(_id, updatedInfoData )
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  
    
  
  
  
  
  
  
  



