import { response } from 'express';
import Module from '../models/Module.js';
import Task from '../models/Task.js';

export async function receiveModules(req, res) {
    try {
        const { projectID, modules } = req.body;

        for (const moduleData of modules) {
            const { module_name, tasks } = moduleData;
            
            const newModule = new Module({ module_name, projectID });
            await newModule.save();

            for (const task of tasks) {
                const newTask = new Task({ module_id: newModule._id, task_description: task });
                await newTask.save();
            }
        }

        console.log('Modules saved successfully');
        res.status(200).json({projectID, message: 'Modules saved successfully' });
    } catch (error) {
        console.error('Error saving modules:', error);
        res.status(500).json({ error: 'Failed to save modules' });
    }
}


export async function getModulesByProjectID(req, res) {
    try {
        const { projectID } = req.params;

        const modules = await Module.find({ projectID }).exec();

        res.status(200).json({ modules });
    } catch (error) {
        console.error('Error retrieving modules by projectID:', error);
        res.status(500).json({ error: 'Failed to retrieve modules by projectID' });
    }
}