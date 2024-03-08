import { Router } from 'express';
import { receiveModules, getModulesByProjectID, updateModule, deleteModule } from '../controllers/moduleController.js';
const router = Router();

router.post('/receive_modules', receiveModules);
router.get('/:projectID', getModulesByProjectID);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);


export default router;
