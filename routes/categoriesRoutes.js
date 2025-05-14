const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoriesController');
//Lấy tất cả danh mục của sản phẩm
router.get('/', categoryController.getAllCategories);
// Thêm một danh mục mới
router.post('/', categoryController.createCategory);
// Xóa danh mục theo ID
router.delete('/:id', categoryController.deleteCategory);
// Cập nhật danh mục theo ID
router.put('/:id', categoryController.updateCategory);
module.exports = router;
