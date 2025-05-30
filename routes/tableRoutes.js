const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// API: Lấy danh sách bàn + đơn hàng
router.get('/tables-with-orders', tableController.getAllTablesWithOrders);

// Toggle ghi chú bàn (bàn trống <-> bàn đã đặt)
router.put('/ghichu/:maban', tableController.updateGhiChuBan);


module.exports = router;