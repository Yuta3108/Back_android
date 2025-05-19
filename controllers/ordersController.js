const db = require('../db');

// Lấy tất cả đơn hàng
exports.getAllOrders = (req, res) => {
    const sql = 'SELECT * FROM donhang ORDER BY madonhang DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
        }
        res.json(results);
    });
};

// Thêm một đơn hàng mới
exports.createOrder = (req, res) => {
    const { tongtien, ghichu, phuongthucthanhtoan, soluong } = req.body;
    const ngaydat = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const trangthai = 'choxuly';

    if (!tongtien || !phuongthucthanhtoan || !soluong) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
    }

    const sql = `
        INSERT INTO donhang (ngaydat, tongtien, trangthai, ghichu, phuongthucthanhtoan, soluong)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [ngaydat, tongtien, trangthai, ghichu || '', phuongthucthanhtoan, soluong];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Lỗi khi thêm đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi thêm đơn hàng' });
        }

        res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', id: result.insertId });
    });
};

// Xóa đơn hàng theo ID
exports.deleteOrder = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM donhang WHERE madonhang = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi xóa đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
        }

        res.json({ message: 'Xóa đơn hàng thành công' });
    });
};

// Cập nhật trạng thái đơn hàng (có điều kiện)
exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { trangthai } = req.body;

    if (!trangthai) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới' });
    }

    const sqlSelect = 'SELECT trangthai FROM donhang WHERE madonhang = ?';
    db.query(sqlSelect, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server khi truy vấn đơn hàng' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const currentStatus = results[0].trangthai;

        // Kiểm tra điều kiện không cho quay lại "choxuly"
        if (currentStatus === 'dathanhcong' && trangthai === 'choxuly') {
            return res.status(400).json({ message: 'Không thể sửa trạng thái về "chờ xử lý" nếu đơn hàng đã thành công' });
        }

        // Cập nhật trạng thái
        const sqlUpdate = 'UPDATE donhang SET trangthai = ? WHERE madonhang = ?';
        db.query(sqlUpdate, [trangthai, id], (err) => {
            if (err) {
                console.error('Lỗi khi cập nhật trạng thái:', err);
                return res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái đơn hàng' });
            }

            res.json({ message: 'Cập nhật trạng thái thành công' });
        });
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

// 📦 Thống kê đơn hàng
exports.getOrderStats = (req, res) => {
    const sqlGeneral = `
        SELECT 
            COUNT(*) AS total_orders,
            SUM(tongtien) AS total_revenue,
            AVG(tongtien) AS average_order_value,
            MAX(tongtien) AS max_order_value,
            MIN(tongtien) AS min_order_value
        FROM donhang;
    `;

    const sqlByStatus = `
        SELECT trangthai, COUNT(*) AS count
        FROM donhang
        GROUP BY trangthai;
    `;

    const sqlByPayment = `
        SELECT phuongthucthanhtoan, COUNT(*) AS count
        FROM donhang
        GROUP BY phuongthucthanhtoan;
    `;

    db.query(sqlGeneral, (err1, generalStats) => {
        if (err1) {
            console.error('Lỗi khi thống kê đơn hàng:', err1);
            return res.status(500).json({ message: 'Lỗi server khi thống kê đơn hàng' });
        }

        db.query(sqlByStatus, (err2, statusStats) => {
            if (err2) {
                console.error('Lỗi thống kê theo trạng thái:', err2);
                return res.status(500).json({ message: 'Lỗi server khi thống kê trạng thái đơn hàng' });
            }

            db.query(sqlByPayment, (err3, paymentStats) => {
                if (err3) {
                    console.error('Lỗi thống kê phương thức thanh toán:', err3);
                    return res.status(500).json({ message: 'Lỗi server khi thống kê phương thức thanh toán' });
                }

                res.status(200).json({
                    data: {
                        ...generalStats[0],
                        byStatus: statusStats,
                        byPayment: paymentStats
                    }
                });
            });
        });
    });
};

