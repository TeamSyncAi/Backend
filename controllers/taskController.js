import Task from '../models/Task.js';

export async function createTask(req, res) {
    try {
        const { module_id, task_description, projectID } = req.body;
        console.log('Received task data:', { module_id, task_description, projectID }); // Log received task data
        const newTask = new Task({ module_id, task_description, projectID });
        const savedTask = await newTask.save();
        console.log('Saved task:', savedTask); // Log saved task
        res.status(201).json(savedTask);
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

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Updating task with ID: ${id}`);
        console.log('Request body:', req.body);

        // Remove module_id and projectID if they are not provided in the request body
        if (!req.body.module_id) {
            delete req.body.module_id;
        }
        if (!req.body.projectID) {
            delete req.body.projectID;
        }

        const updateTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        console.log('Updated task:', updateTask);

        res.status(200).json(updateTask);
    } catch (error) {
        console.error('Error updating task:', error);
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
