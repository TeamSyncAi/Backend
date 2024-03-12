const Models = require('../models/models.js');


exports.createModel = async (req, res) => {
    try {
        const model = await Models.create(req.body);
        res.status(201).json(model);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllModelsAndTasks = async (req, res) => {
    try {
        const models = await Models.find().populate('tasks');
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getModelById = async (req, res) => {
    try {
        const modelId = req.params.model_id;
        const model = await Models.findById(modelId);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getModuleByMember = async (req, res) => {
    try {
        const memberId = req.params.member_id;

        const models = await Models.find({ membersM: memberId }).exec();

        res.status(200).json({ models });
    } catch (error) {
        console.error('Error retrieving models by members:', error);
        res.status(500).json({ error: 'Failed to retrieve models by members' });
    }
};

