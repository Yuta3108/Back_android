const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route cập nhật user
router.put('/users/:id', usersController.updateUser);

module.exports = router;