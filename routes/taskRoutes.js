import { Router } from 'express';
import { createTask, getTasksByModuleID } from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask);
router.get('/:module_id', getTasksByModuleID);


export default router;
