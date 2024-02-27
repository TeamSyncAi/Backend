import { Router } from 'express';
import { Projet } from '../models/planningModel.js';
import { planifierTaches } from '../controllers/planningController';

const router = Router();
router.get('/projets', async (req, res) => {
  try {
    const projets = await Projet.find();
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/:id_projet', planifierTaches);


export default router;
