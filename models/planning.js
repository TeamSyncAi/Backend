// planningModel.js

import { Schema, model } from 'mongoose';

// Schéma MongoDB pour une tâche
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    complexity: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
});

// Modèle MongoDB pour une tâche
const Task = model('Task', TaskSchema);

export default Task;
