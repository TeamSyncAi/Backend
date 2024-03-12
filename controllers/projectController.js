const Project = require('../models/project');


exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getallProject = async (req, res) => {
    try {
       
        const project = await Project.find();

       
        res.status(200).json({ project });
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};
exports.getModelsByProjectId = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId).populate('models');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        } 
        res.json({ models: project.models });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching models', error: error.message });
    }
};