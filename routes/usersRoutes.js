const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route cập nhật user
router.put('/users/:id', usersController.updateUser);

// Route lấy danh sách khách hàng
router.get('/users', usersController.getAllUsers);

// Route xoá khách hàng
router.delete('/users/:id', usersController.deleteUser);

// Thống kê khách hàng
router.get('/users/stats', usersController.getCustomerStats);

module.exports = router;