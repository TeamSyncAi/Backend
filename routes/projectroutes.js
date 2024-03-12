const express = require('express');
const router = express.Router();
const { createProject,getallProject,getModelsByProjectId } = require('../controllers/projectController');

router.post('/project', createProject);
router.get('/project', getallProject);
router.get('/project/:projectId', getModelsByProjectId);



module.exports = router;