import express from 'express';
import { getAllProjects, createProject, updateProject, deleteProject } from '../controllers/calendrierController';

const router = express.Router();

router.get('/getprojects', getAllProjects);
router.post('/createprojects', createProject);
router.put('/updateprojects/:id', updateProject);
router.delete('/deleteprojects/:id', deleteProject);

export default router;
