import Module from '../models/Module.js';
import Task from '../models/Task.js';

export async function receiveModules(req, res) {
    try {
        const modulesData = req.body.modules;

        for (const moduleData of modulesData) {
            const { module_name, tasks } = moduleData;
            
            const newModule = new Module({ module_name });
            await newModule.save();

            for (const task of tasks) {
                const newTask = new Task({ module_id: newModule._id, task_description: task });
                await newTask.save();
            }
        }

        console.log('Modules saved successfully');
        res.status(200).json({ message: 'Modules saved successfully' });
    } catch (error) {
        console.error('Error saving modules:', error);
        res.status(500).json({ error: 'Failed to save modules' });
    }
}
