// planningRoute.js

import { Router } from 'express';
const router = Router();
import { createTask, updateTask, deleteTask } from '../controllers/planningController.js';

// Route pour créer une nouvelle tâche
router.post('/createtasks', createTask);

// Route pour mettre à jour une tâche avec l'IA
router.put('/updatetasks/:id', updateTask);

// Route pour supprimer les tâches terminées
router.delete('/tasks/completed', deleteTask);

export default router;
