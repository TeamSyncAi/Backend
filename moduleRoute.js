import { Router } from 'express';
import { receiveModules, getModulesByProjectID, updateModule, deleteModule, createDefaultModule } from '../controllers/moduleController.js';
const router = Router();

router.post('/receive_modules', receiveModules);
router.get('/project/:projectID', getModulesByProjectID);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);
router.post('/defaultM/:projectID',createDefaultModule);


export default router;
