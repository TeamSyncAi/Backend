import { Router } from 'express';
import { createDefaultTask, createTask, deleteTask, getTaskByUserId, getTasksByModuleID, updateTask } from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask);
router.get('/modul/:module_id', getTasksByModuleID);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/default',createDefaultTask)
router.get('/user/:user',getTaskByUserId)



export default router;
