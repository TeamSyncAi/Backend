import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    module_name: String,
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
