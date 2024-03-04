import { Router } from 'express';
import { receiveModules } from '../controllers/moduleController.js';
const router = Router();

router.post('/receive_modules', receiveModules);

export default router;
