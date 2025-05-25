const express = require('express');
const router = express.Router();
const sizesanphamController = require('../controllers/sizesanphamController');





//Xóa 1 size sản phẩm 
router.delete('/:masizeproduct', sizesanphamController.deleteSizeProductById);


// Cập nhật giá theo sản phẩm và size
router.put('/update-price', sizesanphamController.updateGiaByProductAndSize);

// Lấy size theo id sản phẩm
router.get('/:masanpham', sizesanphamController.getSizeByProductId);

//Lấy danh sách size
router.get("/", sizesanphamController.getAllSizes);

// Thêm size mới
router.post("/", sizesanphamController.addSize);

// Cập nhật size
router.put("/:masize", sizesanphamController.updateSize);

// Xoá size
router.delete("/:masize", sizesanphamController.deleteSize);

module.exports = router;
