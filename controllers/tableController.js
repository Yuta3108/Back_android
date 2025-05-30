const db = require('../db');

// Lấy danh sách bàn kèm đơn hàng và tên người dùng
exports.getAllTablesWithOrders = (req, res) => {
    const sql = `
    SELECT 
      ban.maban,              
      ban.tenban,
      ban.ghichu,
      donhang.ngaydat,
      donhang.tongtien,
      donhang.phuongthucthanhtoan,
      users.name AS tenkhach
    FROM ban
    LEFT JOIN donhang ON ban.maban = donhang.maban
    LEFT JOIN users ON donhang.mauser = users.id
    ORDER BY donhang.ngaydat DESC
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.json({ data: results }); // ✅ Trả về dữ liệu
    });
};


// Cập nhật ghi chú bàn theo nội dung từ client
exports.updateGhiChuBan = (req, res) => {
    const { maban } = req.params;
    const { ghichu } = req.body;

    if (!ghichu) {
        return res.status(400).json({ error: 'Thiếu nội dung ghi chú' });
    }

    const updateQuery = 'UPDATE ban SET ghichu = ? WHERE maban = ?';

    db.query(updateQuery, [ghichu, maban], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi truy vấn UPDATE' });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bàn' });
        }

        res.status(200).json({ message: 'Cập nhật ghi chú thành công', ghichu });
    });
};

