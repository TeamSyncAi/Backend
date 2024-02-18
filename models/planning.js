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
    duration: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // Autres champs de la tâche
});

// Modèle MongoDB pour une tâche
const Task = model('Task', TaskSchema);

export default Task;
