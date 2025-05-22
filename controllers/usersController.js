const db = require('../db');

// Cập nhật thông tin khách hàng
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { email, password, name, phone, address } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password || !name || !phone || !address) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const sql = 'UPDATE users SET email = ?, password = ?, name = ?, phone = ?, address = ? WHERE id = ?';
    db.query(sql, [email, password, name, phone, address, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Email đã tồn tại' });
            }
            console.error("Lỗi khi cập nhật:", err);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json({ message: 'Cập nhật khách hàng thành công' });
    });
};