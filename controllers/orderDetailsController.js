const db = require('../db');

// Lấy chi tiết đơn hàng theo mã đơn hàng
exports.getOrderDetailsByOrderId = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM chitietdonhang WHERE madonhang = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        }

        res.json(results);
    });
};

// Thêm chi tiết đơn hàng mới
exports.createOrderDetail = (req, res) => {
    const { madonhang, masanpham, tonggia } = req.body;

    if (!madonhang || !masanpham || !tonggia) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: madonhang, masanpham, tonggia' });
    }

    const sql = 'INSERT INTO chitietdonhang (madonhang, masanpham, tonggia) VALUES (?, ?, ?)';
    db.query(sql, [madonhang, masanpham, tonggia], (err, result) => {
        if (err) {
            console.error("Lỗi khi thêm chi tiết đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi thêm chi tiết đơn hàng' });
        }

        res.status(201).json({ message: 'Thêm chi tiết đơn hàng thành công', machitiet: result.insertId });
    });
};

// Xóa chi tiết đơn hàng theo machitiet
exports.deleteOrderDetail = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM chitietdonhang WHERE machitiet = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa chi tiết đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server khi xóa chi tiết đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng để xóa' });
        }

        res.json({ message: 'Xóa chi tiết đơn hàng thành công' });
    });
};

// Cập nhật chi tiết đơn hàng theo machitiet
exports.updateOrderDetail = (req, res) => {
    const { id } = req.params;
    const { masanpham, tonggia } = req.body;

    if (!masanpham || !tonggia) {
        return res.status(400).json({ message: 'Vui lòng cung cấp masanpham và tonggia mới' });
    }

    const sql = 'UPDATE chitietdonhang SET masanpham = ?, tonggia = ? WHERE machitiet = ?';
    db.query(sql, [masanpham, tonggia, id], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật chi tiết đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật chi tiết đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng để cập nhật' });
        }

        res.json({ message: 'Cập nhật chi tiết đơn hàng thành công' });
    });
};

exports.getOrderDetails = (req, res) => {
    const { madonhang } = req.params;

    const sql = `
        SELECT 
            p.name AS product_name,
            p.price AS dongia,
            dh.soluong,
            ct.tonggia
        FROM chitietdonhang ct
        LEFT JOIN donhang dh ON ct.madonhang = dh.madonhang
        LEFT JOIN products p ON ct.masanpham = p.id
        WHERE ct.madonhang = ?
    `;

    db.query(sql, [madonhang], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }

        res.json(results);
    });
};

