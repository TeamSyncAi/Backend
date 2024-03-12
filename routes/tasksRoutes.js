const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskByUserId } = require('../controllers/tasksController');

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.get('/tasks/:user', getTaskByUserId);






module.exports = router;