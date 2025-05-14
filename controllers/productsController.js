const db = require('../db');

// Lấy danh sách sản phẩm
exports.getAllProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.json(results);
    });
};
// thêm 1 sản phẩm mới vào bảng
exports.addProduct = (req, res) => {
    const { name, price, category_id, img } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm' });
    }

    const sql = 'INSERT INTO products (name, price, category_id, img) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, price, category_id, img || null], (err, result) => {
        if (err) {
            console.error(' Lỗi thêm sản phẩm:', err);
            return res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm' });
        }

        res.status(201).json({ message: ' Thêm sản phẩm thành công!', productId: result.insertId });
    });
};
//Xóa 1 sản phẩm dựa theo id
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;

    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa sản phẩm:', err);
            return res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }

        res.json({ message: 'Xóa sản phẩm thành công!' });
    });
};

//Update sản phẩm theo id
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, price, category_id, img } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin cần cập nhật' });
    }

    const sql = `
        UPDATE products 
        SET name = ?, price = ?, category_id = ?, img = ?
        WHERE id = ?
    `;

    db.query(sql, [name, price, category_id, img || null, productId], (err, result) => {
        if (err) {
            console.error('❌ Lỗi cập nhật sản phẩm:', err);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        res.json({ message: '✅ Cập nhật sản phẩm thành công!' });
    });
};

