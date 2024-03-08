import axios from 'axios';
import Project from '../models/Project.js';

export function createProject(req, res) {
    const { name, startDate, endDate, description, keywords, members, teamLeader } = req.body;

    // Create a new project document
    Project.create({
        name,
        startDate,
        endDate,
        description,
        keywords,
        teamLeader,
        members
    })
    .then(savedProject => {
        console.log('Project saved successfully:', savedProject);

        // Extract the _id from the saved project
        const projectData = {
            _id: savedProject._id,
            name,
            startDate,
            endDate,
            description,
            keywords,
            teamLeader,
            members
        };

        // Now, generate project modules
        axios.post('http://127.0.0.1:5000/generate_project_modules', projectData)
            .then(response => {
                console.log('Server Response:', response); 
                res.json({ project: savedProject, modules: response.data.modules });
            })
            .catch(error => {
                console.error('Error generating project modules:', error);
                res.status(500).json({ error: 'Error generating project modules' });
            });
    })
    .catch(error => {
        console.error('Error saving project:', error);
        res.status(500).json({ error: 'Error saving project' });
    });
}
