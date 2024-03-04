import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    module_name: String,
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } // Assuming you have a Project model
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
