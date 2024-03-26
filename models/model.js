import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schéma pour une tâche
const TasksSchema = new Schema({
    task_name: { type: String, required: false },
    task_description: { type: String, required: true },  
    duration: { type: Number, required: false },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false } 
    
});

// Schéma pour un module
const ModulesSchema = new Schema({
    module_name: { type: String, required: true },
    total_duration: { type: Number, required: false },
    module_start_date: { type: Date, required: false },
    module_end_date: { type: Date, required: false }, 

    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]// Référence aux tâches
    
});

// Schéma pour un projet
const ProjectsSchema = new Schema({
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }], // Référence aux modules
    total_duration: { type: Number, required: true }, // Durée totale du projet
    start_date: { type: Date, required: false }, // Date de début du projet
    end_date: { type: Date, required: false } // Date de fin du projet
    
    
    
});

// Définir les modèles
const Tasks = mongoose.model('Task', TasksSchema);
const Modules = mongoose.model('Module', ModulesSchema);
const Projects = mongoose.model('Project', ProjectsSchema);

export { Tasks, Modules, Projects };
