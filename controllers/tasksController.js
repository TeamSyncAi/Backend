const Task = require('../models/task.js');

// Controller function to create a new task
exports.createTask = async (req, res) => {
    try {
        // Extract task data from request body
        const { title, user } = req.body;

        // Create a new task
        const task = await Task.create({
            title,
            user

        });

        // Send the newly created task as response
        res.status(201).json({ task });
    } catch (error) {
        // If an error occurs, send error response
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get all tasks
exports.getTasks = async (req, res) => {
    try {
        // Retrieve all tasks from the database
        const tasks = await Task.find();

        // Send tasks as response
        res.status(200).json({ tasks });
    } catch (error) {
        // If an error occurs, send error response
        res.status(500).json({ message: error.message });
    }
};
exports.getTaskByUserId = async (req, res) => {
    try {
        const { user } = req.params;

        const tasks = await Task.find({ user }).exec();

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error retrieving tasks by user:', error);
        res.status(500).json({ error: 'Failed to retrieve tasks by user' });
    }
};




