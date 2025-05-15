const express = require('express');
const router = express.Router();
const sizesanphamController = require('../controllers/sizesanphamController');

// Route GET: Lấy toàn bộ size sản phẩm
router.get('/', sizesanphamController.getAllSizes);

// Thêm 1 size sản phẩm vào bảng mới
router.post('/', sizesanphamController.createSize);

//Xóa 1 size sản phẩm 
router.delete('/:masize', sizesanphamController.deleteSize);

//Sửa 1 size sản phẩm
router.put('/:masize', sizesanphamController.updateSize);

module.exports = router;
