import Task from '../models/Task.js';

export async function createTask(req, res) {
    try {
        const { module_id, task_description } = req.body;
        const newTask = new Task({ module_id, task_description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
}
export async function getTasksByModuleID(req, res) {
    try {
        const { module_id } = req.params;
        const tasks = await Task.find({ module_id }).exec();
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error retrieving tasks by module_id:', error);
        res.status(500).json({ error: 'Failed to retrieve tasks by module_id' });
    }
}

export const updateTask = async (req,res) => {
    try {
        const { id } = req.params;
        const updateTask = await Task.findByIdAndUpdate(id, req.body, { new: true});
        res.status(200).json(updateTask);
    
    } catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}

export const deleteTask = async (req,res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'task deleted'});
    } catch (error) {
        res.status(400).json({ message: error.message});
        
    }
}