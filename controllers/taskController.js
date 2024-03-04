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
