const db = require('../db');

//Lấy tất cả danh mục sản phẩm
exports.getAllCategories = (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách categories:", err);
            return res.status(500).json({ message: 'Lỗi server khi lấy categories' });
        }
        res.json(results);
    });
};

// Thêm một danh mục mới
exports.createCategory = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    }

    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error("Lỗi khi thêm category:", err);
            return res.status(500).json({ message: 'Lỗi server khi thêm category' });
        }

        res.status(201).json({ message: 'Thêm category thành công', id: result.insertId });
    });
};

// Xóa danh mục theo ID
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa category:", err);
            return res.status(500).json({ message: 'Lỗi server khi xóa category' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy category để xóa' });
        }

        res.json({ message: 'Xóa category thành công' });
    });
};

// Sửa danh mục theo ID
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    }

    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật category:", err);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật category' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy category để cập nhật' });
        }

        res.json({ message: 'Cập nhật category thành công' });
    });
};
