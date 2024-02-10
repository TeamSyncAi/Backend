export function errorHandler(err, req, res, next) {
    console.error(`Erreur survenue : ${err.message}`);
  
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message, errors: err.errors });
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404).json({ error: 'ID invalide' });
    } else if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({ error: 'Erreur de clé en double', champ: err.keyValue });
    } else {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
  
  export function notFoundError(req, res, next) {
    console.error(`Ressource non trouvée : ${req.originalUrl}`);
    res.status(404).json({ error: `Ressource non trouvée - ${req.originalUrl}` });
  }
  