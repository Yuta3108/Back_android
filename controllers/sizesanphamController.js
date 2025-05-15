const db = require('../db');



// Thêm một size sản phẩm mới
exports.createSizeProduct = (req, res) => {
  const { masize, masanpham } = req.body;

  if (!masize || !masanpham) {
    return res.status(400).json({ error: 'Vui lòng cung cấp masize, masanpham ' });
  }

  const sql = 'INSERT INTO sizeproduct (masize, masanpham) VALUES (?, ?)';

  db.query(sql, [masize, masanpham], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm size sản phẩm:', err);
      return res.status(500).json({ error: 'Lỗi server khi thêm size sản phẩm' });
    }

    res.status(201).json({ message: 'Thêm size sản phẩm thành công!', insertId: result.insertId });
  });
};

// Xoá một dòng trong bảng sizeproduct theo masizeproduct
exports.deleteSizeProductById = (req, res) => {
  const { masizeproduct } = req.params;

  const sql = 'DELETE FROM sizeproduct WHERE masizeproduct = ?';

  db.query(sql, [masizeproduct], (err, result) => {
    if (err) {
      console.error('Lỗi khi xoá size sản phẩm theo masizeproduct:', err);
      return res.status(500).json({ error: 'Lỗi server khi xoá size sản phẩm' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy size sản phẩm với masizeproduct này' });
    }

    res.status(200).json({ message: 'Xoá size sản phẩm thành công!' });
  });
};



// Lấy size và giá dựa theo mã sản phẩm
exports.getSizeByProductId = (req, res) => {
  const { masanpham } = req.params;

  const sql = `
    SELECT 
      sp.masizeproduct,
      ss.size,
      gs.gia
    FROM sizeproduct sp
    JOIN sizesanpham ss ON sp.masize = ss.masize
    JOIN giasize gs ON sp.masanpham = gs.masanpham AND sp.masize = gs.masize
    WHERE sp.masanpham = ?
  `;

  db.query(sql, [masanpham], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn size và giá theo sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.status(200).json(results);
  });
};

// Cập nhật giá theo masanpham và masize
exports.updateGiaByProductAndSize = (req, res) => {
  const { masanpham, masize, gia } = req.body;

  if (!masanpham || !masize || !gia) {
    return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ size, giá và mã sản phẩm" });
  }

  const sql = `
    UPDATE giasize
    SET gia = ?
    WHERE masanpham = ? AND masize = ?
  `;

  db.query(sql, [gia, masanpham, masize], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật giá:", err);
      return res.status(500).json({ error: "Lỗi server khi cập nhật giá" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc size để cập nhật" });
    }

    res.status(200).json({ message: "Cập nhật giá thành công" });
  });
};






