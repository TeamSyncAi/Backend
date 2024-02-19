// planningController.js

// planningController.js
import Task from '../models/planning.js';
import { predictTaskDuration, predictTaskDates } from '../services/aiService.js'; // Ajout de predictTaskDates

export async function createTask(req, res) {
    try {
        console.log("Requête reçue pour créer une nouvelle tâche...");
        const taskData = req.body;
        console.log("Données de la tâche reçues :", taskData);
        const { complexity, size } = taskData;
        console.log("Complexité de la tâche :", complexity);
        console.log("Taille de la tâche :", size);
        
        console.log("Prédiction de la durée de la tâche...");
        const duration = await predictTaskDuration(complexity, size);
        console.log("Durée prédite de la tâche :", duration);

        console.log("Prédiction des dates de début et de fin de la tâche...");
        const dates = predictTaskDates(complexity, size); // Utilisation de predictTaskDates
        console.log("Dates de début et de fin prédites :", dates);

        console.log("Création de la nouvelle tâche dans la base de données...");
        const newTask = new Task({
            title: taskData.title,
            description: taskData.description,
            duration: duration,
            complexity: complexity,
            size: size,
            startDate: dates.startDate, // Ajout des dates de début et de fin
            endDate: dates.endDate
        });

        await newTask.save();
        console.log("Tâche créée avec succès :", newTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Erreur lors de la création de la tâche :", error.message);
        res.status(400).json({ message: error.message });
    }
}


// Contrôleur pour mettre à jour une tâche
// Mettre à jour une tâche existante
export async function updateTask(req, res) {
    try {
        const taskId = req.params.id;
        const updatedTaskData = req.body;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Contrôleur pour supprimer une tâche
export async function deleteTask(req, res) {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndRemove(taskId);

        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
