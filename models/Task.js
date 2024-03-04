import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    task_description: String
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
