'use strict';

var express = require('express');
var controller = require('./tasks.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.post('/',auth.isAuthenticated(),controller.create);
router.delete('/:id',auth.isAuthenticated(),controller.destroy);

module.exports = router;
