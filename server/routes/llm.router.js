const express = require('express');
const { initLLMModel, getAllLLMModels, updateLLMStats, getUserLLMStats } = require('../controllers/llm.controller');
const llmRouter = express.Router();


llmRouter.get('/', initLLMModel);
llmRouter.get('/all', getAllLLMModels);
llmRouter.put('/edit-llm-stats', updateLLMStats);
llmRouter.get('/llm-stats/:userId', getUserLLMStats);
module.exports = llmRouter;