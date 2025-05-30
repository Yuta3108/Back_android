const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { uploadImageMiddleware } = require('../controllers/ImgController');

// ===== ROUTES ===== //

// Lấy tất cả sản phẩm
router.get('/', productsController.getAllProducts);

// Cập nhật sản phẩm theo id (kèm size và giá)
router.put('/up/:id', productsController.updateProductWithSizes);

// API thống kê sản phẩm
router.get('/stats', productsController.getProductStats);

// Lấy sản phẩm có thông tin size + giá
router.get('/products-with-sizes', productsController.getProductListWithSizes);

// Thêm sản phẩm mới (kèm upload ảnh)
router.post('/', uploadImageMiddleware, productsController.addProductWithSizes);

// ❌ Tạm thời xóa vì chưa có hàm controller
// router.post('/:id/add-size', productsController.addSizeToExistingProduct);

// Xóa sản phẩm theo id, kèm size và giá size
router.delete('/:id', productsController.deleteProductWithSizes);

module.exports = router;
