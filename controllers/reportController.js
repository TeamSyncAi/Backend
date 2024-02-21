import Report from '../models/report.js'; 

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
