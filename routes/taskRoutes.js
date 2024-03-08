import { Router } from 'express';
import { createTask, deleteTask, getTasksByModuleID, updateTask } from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask);
router.get('/:module_id', getTasksByModuleID);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);



export default router;
