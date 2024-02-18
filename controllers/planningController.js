// planningController.js

import Task from '../models/planning.js';
import { recommendTaskSchedule } from '../services/aiService';

// Contrôleur pour créer une nouvelle tâche avec recommandation d'IA pour la planification
export async function createTask(req, res) {
    try {
        // Récupérer les données de la nouvelle tâche depuis le corps de la requête
        const taskData = req.body;

        // Obtenir la recommandation de planification de l'IA
        const { duration, startDate, endDate } = await recommendTaskSchedule(taskData);

        // Création de la tâche avec la planification recommandée
        const newTask = new Task({
            title: taskData.title,
            description: taskData.description,
            duration: duration,
            startDate: startDate,
            endDate: endDate,
            // Autres champs de la tâche
        });
        
        // Enregistrer la nouvelle tâche dans la base de données
        await newTask.save();
        
        // Répondre avec la nouvelle tâche créée
        res.status(201).json(newTask);
    } catch (error) {
        // En cas d'erreur, renvoyer un message d'erreur avec le statut 400 (Bad Request)
        res.status(400).json({ message: error.message });
    }
}

// Contrôleur pour mettre à jour une tâche avec l'IA
export async function updateTaskWithAI(req, res) {
  try {
      const { id } = req.params;
     
      const taskDataToUpdate = req.body;
      
      // Récupérer la tâche existante depuis la base de données en utilisant findById
      const existingTask = await Task.findById(id);
      
      if (!existingTask) {
          return res.status(404).json({ message: "La tâche n'a pas été trouvée." });
      }
      
      // Obtenir la recommandation de planification de l'IA pour les modifications souhaitées
      const { duration, startDate, endDate } = await recommendTaskSchedule(taskDataToUpdate);
      
      // Mettre à jour la tâche avec les modifications recommandées par l'IA
      existingTask.title = taskDataToUpdate.title || existingTask.title;
      existingTask.description = taskDataToUpdate.description || existingTask.description;
      existingTask.duration = duration || existingTask.duration;
      existingTask.startDate = startDate || existingTask.startDate;
      existingTask.endDate = endDate || existingTask.endDate;
      
      // Enregistrer les modifications dans la base de données
      await existingTask.save();
      
      // Répondre avec la tâche mise à jour
      res.json(existingTask);
  } catch (error) {
      // En cas d'erreur, renvoyer un message d'erreur avec le statut 400 (Bad Request)
      res.status(400).json({ message: error.message });
  }
}

// Contrôleur pour identifier et supprimer les tâches terminées
export async function deleteCompletedTasks(req, res) {
    try {
        // Récupérer toutes les tâches depuis la base de données
        const tasks = await find();
        
        // Identifier les tâches terminées avec l'IA
        const completedTasks = tasks.filter(task => task.endDate <= new Date());
        
        // Supprimer les tâches terminées de la base de données
        for (const task of completedTasks) {
            await findByIdAndDelete(task._id);
        }
        
        // Répondre avec les tâches supprimées
        res.json({ message: 'Tâches terminées supprimées avec succès', deletedTasks: completedTasks });
    } catch (error) {
        // En cas d'erreur, renvoyer un message d'erreur avec le statut 500 (Internal Server Error)
        res.status(500).json({ message: error.message });
    }
}
