// planningRoute.js

import { Router } from 'express';
const router = Router();
import { createTask, updateTaskWithAI, deleteCompletedTasks } from '../controllers/planningController.js';

// Route pour créer une nouvelle tâche
router.post('/tasks', createTask);

// Route pour mettre à jour une tâche avec l'IA
router.put('/updatetasks/:id', updateTaskWithAI);

// Route pour supprimer les tâches terminées
router.delete('/tasks/completed', deleteCompletedTasks);

export default router;
