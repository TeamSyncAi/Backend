const express = require('express');
const router = express.Router();
const { createModel, getAllModelsAndTasks,getModelById, getModuleByMember  } = require('../controllers/modelsController');

router.post('/models', createModel);
router.get('/models', getAllModelsAndTasks);
router.get('/models/:model_id', getModelById);
router.get('/models/member/:member_id', getModuleByMember);



module.exports = router;