const express = require('express');
const router = express.Router();
const sizesanphamController = require('../controllers/sizesanphamController');



// Thêm 1 size sản phẩm vào bảng mới
router.post('/', sizesanphamController.createSizeProduct);


//Xóa 1 size sản phẩm 
router.delete('/:masizeproduct', sizesanphamController.deleteSizeProductById);

// Lấy size theo id sản phẩm
router.get('/:masanpham', sizesanphamController.getSizeByProductId);

// Cập nhật giá theo sản phẩm và size
router.put('/update-price', sizesanphamController.updateGiaByProductAndSize);


module.exports = router;
