const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
// Thống kê khách hàng
router.get('/users/stats', usersController.getCustomerStats);

// Route lấy thông tin chi tiết user theo id
router.get('/users/:id', usersController.getUserById);

// Route lấy danh sách khách hàng
router.get('/users', usersController.getAllUsers);

// Route cập nhật user
router.put('/users/:id', usersController.updateUser);

// Route xoá khách hàng
router.delete('/users/:id', usersController.deleteUser);


module.exports = router;