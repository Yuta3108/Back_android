const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');


// Route: GET /api/products
//Lấy hết tất cả sản phẩm có trong bảng
router.get('/', productsController.getAllProducts);
//Thêm 1 sản phẩm vô bảng
router.post('/', productsController.addProduct);
//Xóa 1 sản phẩm dựa theo id
router.delete('/:id', productsController.deleteProduct);
//update sản phẩm dựa theo id
router.put('/:id', productsController.updateProduct);
// ✅ Thêm API thống kê sản phẩm
router.get('/stats', productsController.getProductStats);
module.exports = router;