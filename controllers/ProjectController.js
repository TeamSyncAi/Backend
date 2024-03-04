import { post } from 'axios';

export function createProject(req, res) {
  const { name, startDate, endDate, description, keywords, members, teamLeader } = req.body;
  
  const projectData = {
    name,
    description,
    keywords
  };

  post('http://localhost:5000/generate_project_modules', projectData)
    .then(response => {
      console.log('Generated modules:', response.data.modules);
      res.json(response.data.modules);
    })
    .catch(error => {
      console.error('Error generating project modules:', error);
      res.status(500).json({ error: 'Error generating project modules' });
    });
}
