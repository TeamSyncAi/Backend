import { Router } from 'express';
const router = Router();
import {  createProject, predictTaskDurations, getAllProjectsWithModulesAndTasks, getProjectWithModulesAndTasks, updateProjectWithModulesAndTasks } from '../controllers/planningController.js';
import { Tasks, Projects, Modules } from '../Models/models.js';


router.post('/projects', createProject);

router.get('/getprojects/:projectId', getProjectWithModulesAndTasks);

router.get('/getprojects-with-modules-tasks', getAllProjectsWithModulesAndTasks);

router.put('/updateprojects/:projectId', updateProjectWithModulesAndTasks);

router.get('/predict_task_durations/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const predictionResponse = await predictTaskDurations(projectId);

        if (predictionResponse.modules) {
            const modules = predictionResponse.modules;

            // Parcourir chaque module
            for (const module of modules) {
                const tasks = module.tasks;

                // Parcourir chaque tâche dans le module
                for (const task of tasks) {
                    const taskId = task.id;
                    const duration = task.duration;
                    const startDate = task.start_date;
                    const endDate = task.end_date;

                    // Mettre à jour la tâche dans la base de données
                    await Tasks.findByIdAndUpdate(taskId, { duration, start_date: startDate, end_date: endDate });

                    // Afficher les informations de la tâche dans la console
                    console.log(`Tâche mise à jour - ID: ${taskId}, Durée: ${duration}, Date de début: ${startDate}, Date de fin: ${endDate}`);
                }

                // Mettre à jour le module dans la base de données
                await Modules.findByIdAndUpdate(module.id, { total_duration: module.total_duration, module_start_date: module.module_start_date, module_end_date: module.module_end_date });

                // Afficher les informations du module dans la console
                console.log(`Module mis à jour - ID: ${module.id}, Durée totale: ${module.total_duration}, Date de début: ${module.module_start_date}, Date de fin: ${module.module_end_date}`);
            }

            // Mettre à jour le projet dans la base de données
            await Projects.findByIdAndUpdate(projectId, {
                total_duration: predictionResponse.total_duration,
                start_date: predictionResponse.project_start_date,
                end_date: predictionResponse.project_end_date
            });

            // Afficher les informations du projet dans la console
            console.log(`Projet mis à jour - ID: ${projectId}, Durée totale: ${predictionResponse.total_duration}, Date de début: ${predictionResponse.project_start_date}, Date de fin: ${predictionResponse.project_end_date}`);
        }

        res.status(200).json(predictionResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
