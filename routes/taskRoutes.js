import { Router } from 'express';
import { createTask } from '../controllers/taskController.js';

const router = Router();

router.post('/tasks', createTask);

export default router;
