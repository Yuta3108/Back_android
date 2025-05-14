const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Lấy tất cả đơn hàng
router.get('/', ordersController.getAllOrders);

// Tạo một đơn hàng mới
router.post('/', ordersController.createOrder);

// Xóa đơn hàng theo ID
router.delete('/:id', ordersController.deleteOrder);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', ordersController.updateOrderStatus);


module.exports = router;

