import express from 'express';
import { getAllGeneralProjects, synchronizeWithAdminCalendar } from '../controllers/calendriergeneralController.js';

const router = express.Router();

router.get('/general-projects', getAllGeneralProjects); // Route pour récupérer tous les projets du calendrier général
router.post('/synchronize', synchronizeWithAdminCalendar); // Route pour déclencher la synchronisation avec le calendrier de l'administrateur

export default router;
