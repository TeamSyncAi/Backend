import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    module_name: String,
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } 
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
