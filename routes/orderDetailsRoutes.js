const express = require('express');
const router = express.Router();
const orderDetailsController = require('../controllers/orderDetailsController');

// API: Lấy chi tiết đơn hàng theo mã đơn hàng
router.get('/:id', orderDetailsController.getOrderDetailsByOrderId);

// API: Thêm chi tiết đơn hàng
router.post('/', orderDetailsController.createOrderDetail);

// API: Xóa chi tiết đơn hàng
router.delete('/:id', orderDetailsController.deleteOrderDetail);

// API: Cập nhật chi tiết đơn hàng
router.put('/:id', orderDetailsController.updateOrderDetail);


router.get("/donhang/:madonhang", orderDetailsController.getOrderDetails);
module.exports = router;
