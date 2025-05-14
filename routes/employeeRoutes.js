const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Lấy danh sách tất cả nhân viên
router.get('/', employeeController.getAllEmployees);

// Thêm một nhân viên mới
router.post('/', employeeController.addEmployee);

// Cập nhật thông tin nhân viên theo ID
router.put('/:id', employeeController.updateEmployee);

// Xoá nhân viên theo ID
router.delete('/:id', employeeController.deleteEmployee);


module.exports = router;
