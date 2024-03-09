import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    task_description: { type: String, required: true },
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true } 
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
