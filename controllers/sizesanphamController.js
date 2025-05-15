const db = require('../db');

// Lấy tất cả size sản phẩm
exports.getAllSizes = (req, res) => {
  const sql = 'SELECT * FROM sizesanpham';
  db.query(sql, (err, results) => { // ✅ Sử dụng db chứ không phải connection
    if (err) {
      console.error('❌ Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.status(200).json(results);
  });
};

// Thêm một size sản phẩm mới
exports.createSize = (req, res) => {
  const { size, gia, masanpham } = req.body;

  if (!size || !gia || !masanpham) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ size, giá và mã sản phẩm' });
  }

  const sql = 'INSERT INTO sizesanpham (size, gia, masanpham) VALUES (?, ?, ?)';
  db.query(sql, [size, gia, masanpham], (err, result) => {
    if (err) {
      console.error('❌ Lỗi thêm size:', err);
      return res.status(500).json({ error: 'Lỗi server khi thêm size sản phẩm' });
    }
    res.status(201).json({ message: 'Thêm size sản phẩm thành công!', insertedId: result.insertId });
  });
};

// Xoá một size sản phẩm theo masize
exports.deleteSize = (req, res) => {
  const { masize } = req.params;

  const sql = 'DELETE FROM sizesanpham WHERE masize = ?';
  db.query(sql, [masize], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi xoá size:', err);
      return res.status(500).json({ error: 'Lỗi server khi xoá size sản phẩm' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy size với masize này' });
    }

    res.status(200).json({ message: 'Xoá size sản phẩm thành công!' });
  });
};

//Sửa size sản phẩm 
exports.updateSize = (req, res) => {
  const { masize } = req.params;
  const { size, gia, masanpham } = req.body;

  if (!size || !gia || !masanpham) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ size, giá và mã sản phẩm' });
  }

  const sql = 'UPDATE sizesanpham SET size = ?, gia = ?, masanpham = ? WHERE masize = ?';
  db.query(sql, [size, gia, masanpham, masize], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi cập nhật size:', err);
      return res.status(500).json({ error: 'Lỗi server khi cập nhật size sản phẩm' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy size với masize này' });
    }

    res.status(200).json({ message: 'Cập nhật size sản phẩm thành công!' });
  });
};

