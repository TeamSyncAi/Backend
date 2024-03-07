import { Router } from 'express';
import { receiveModules, getModulesByProjectID } from '../controllers/moduleController.js';
const router = Router();

router.post('/receive_modules', receiveModules);
router.get('/:projectID', getModulesByProjectID);


export default router;
