const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const multer = require('multer');
const path = require('path');

// Thiết lập nơi lưu file và tên file khi upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img'); // lưu ảnh vào thư mục img
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

// ===== ROUTES ===== //

// Lấy tất cả sản phẩm
router.get('/', productsController.getAllProducts);

// Xoá sản phẩm theo id
router.delete('/:id', productsController.deleteProduct);

// Cập nhật sản phẩm theo id
router.put('/:id', productsController.updateProduct);

// API thống kê sản phẩm
router.get('/stats', productsController.getProductStats);

// Lấy sản phẩm có thông tin size + giá
router.get('/products-with-sizes', productsController.getProductListWithSizes);

// ✅ Thêm sản phẩm mới (gồm size, giá — KHÔNG CÒN upload ảnh)
router.post('/', productsController.addProductWithSizes);

//Thêm 1 giá mới vào size của sản phẩm đã có sẵn 
router.post('/:id/add-size', productsController.addSizeToExistingProduct);

module.exports = router;
