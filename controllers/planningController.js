
import axios from 'axios';
import { Tasks, Modules, Projects } from '../Models/models.js';

export async function createProject(req, res) {
  try {
    const { modules, total_duration } = req.body;

    if (!modules || !Array.isArray(modules)) {
      return res.status(400).json({ message: 'Invalid project data: modules must be an array' });
    }

    if (typeof total_duration !== 'number' || total_duration < 0) {
      return res.status(400).json({ message: 'Invalid project data: total_duration must be a positive number' });
    }

    const validatedModules = await Promise.all(modules.map(async (moduleData) => {
      const { module_name, tasks } = moduleData;

      if (!module_name || typeof module_name !== 'string') {
        throw new Error('Invalid module data: module_name must be a string');
      }

      if (!tasks || !Array.isArray(tasks)) {
        throw new Error('Invalid module data: tasks must be an array');
      }

      const taskIds = await Promise.all(tasks.map(async (taskData) => {
        const { task_name, task_description } = taskData;
        const newTask = new Tasks({ task_name, task_description });
        const savedTask = await newTask.save();
        return savedTask._id;
      }));

      const newModule = new Modules({ module_name, tasks: taskIds });
      return newModule.save();
    }));

    const newProject = new Projects({ modules: validatedModules.map(module => module._id), total_duration });
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



export async function predictTaskDurations(projectId) {
  try {
      const response = await axios.get(`http://localhost:5000/predict_task_durations/${projectId}`);
      return response.data; // Retourne toute la réponse
  } catch (error) {
      throw new Error('Error fetching task durations from server');
  }
}


export async function getAllProjectsWithModulesAndTasks(req, res) {
  try {
      // Utilisez la méthode populate() pour remplacer les références d'ID par les objets correspondants
      const allProjects = await Projects.find().populate({
          path: 'modules',
          populate: {
              path: 'tasks',
              model: 'Task'
          }
      });

      // Vérifiez si des projets ont été trouvés
      if (allProjects.length === 0) {
          return res.status(404).json({ message: 'Aucun projet trouvé' });
      }

      // Envoyez les projets récupérés en tant que réponse
      res.status(200).json(allProjects);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

export async function getProjectWithModulesAndTasks(req, res) {
  try {
      const projectId = req.params.projectId;

      // Utilisez la méthode populate() pour remplacer les références d'ID par les objets correspondants
      const project = await Projects.findById(projectId).populate({
          path: 'modules',
          populate: {
              path: 'tasks',
              model: 'Task'
          }
      });

      // Vérifiez si le projet a été trouvé
      if (!project) {
          return res.status(404).json({ message: 'Projet non trouvé' });
      }

      // Envoyez le projet récupéré en tant que réponse
      res.status(200).json(project);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}





// Fonction pour modifier un projet avec ses modules et ses tâches associées
export async function updateProjectWithModulesAndTasks(req, res) {
    try {
        const projectId = req.params.projectId;
        const updatedProjectData = req.body; // Données mises à jour du projet

        // Vérifiez si le projet existe
        const existingProject = await Projects.findById(projectId);
        if (!existingProject) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Mise à jour des données du projet
        await Projects.findByIdAndUpdate(projectId, updatedProjectData);

        // Mise à jour des modules et des tâches associées
        for (const moduleData of updatedProjectData.modules) {
            const moduleId = moduleData._id;
            const updatedModuleData = { ...moduleData };
            delete updatedModuleData._id; // Supprimer l'ID du module pour éviter les problèmes de mise à jour

            await Modules.findByIdAndUpdate(moduleId, updatedModuleData);

            // Mise à jour des tâches associées
            for (const taskData of moduleData.tasks) {
                const taskId = taskData._id;
                const updatedTaskData = { ...taskData };
                delete updatedTaskData._id; // Supprimer l'ID de la tâche pour éviter les problèmes de mise à jour

                await Tasks.findByIdAndUpdate(taskId, updatedTaskData);
            }
        }

        res.status(200).json({ message: 'Projet mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}

