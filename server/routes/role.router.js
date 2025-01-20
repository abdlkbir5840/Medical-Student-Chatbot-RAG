const express = require('express');
const { initRoleModel } = require('../controllers/role.controller');
const roleRouter = express.Router();


roleRouter.get('/', initRoleModel);

module.exports = roleRouter;