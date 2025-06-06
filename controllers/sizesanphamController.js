const db = require('../db');


// Xoá một dòng trong bảng sizeproduct theo masizeproduct
// exports.deleteSizeProductById = (req, res) => {
//   const { masizeproduct } = req.params;

//   const sql = 'DELETE FROM sizeproduct WHERE masizeproduct = ?';

//   db.query(sql, [masizeproduct], (err, result) => {
//     if (err) {
//       console.error('Lỗi khi xoá size sản phẩm theo masizeproduct:', err);
//       return res.status(500).json({ error: 'Lỗi server khi xoá size sản phẩm' });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy size sản phẩm với masizeproduct này' });
//     }

//     res.status(200).json({ message: 'Xoá size sản phẩm thành công!' });
//   });
// };


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
//API lấy danh sách size sản phẩm 
exports.getAllSizes = (req, res) => {
  const sql = `SELECT masize, size FROM sizesanpham ORDER BY masize`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách size:", err.message);
      return res.status(500).json({ message: 'Lỗi server khi lấy danh sách size' });
    }

    res.status(200).json({
      message: "Lấy danh sách size thành công",
      data: result
    });
  });
};
// Thêm size sản phẩm
exports.addSize = (req, res) => {
  const { size } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!size || size.trim() === "") {
    return res.status(400).json({ message: "Tên size không được để trống" });
  }

  const sql = `INSERT INTO sizesanpham (size) VALUES (?)`;

  db.query(sql, [size.trim()], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm size:", err.message);
      return res.status(500).json({ message: "Lỗi server khi thêm size" });
    }

    res.status(201).json({
      message: "Thêm size thành công",
      data: {
        masize: result.insertId,
        size: size.trim()
      }
    });
  });
};
// Sửa size sản phẩm
exports.updateSize = (req, res) => {
  const { masize } = req.params;
  const { size } = req.body;

  if (!size || size.trim() === "") {
    return res.status(400).json({ message: "Tên size không được để trống" });
  }

  const sql = `UPDATE sizesanpham SET size = ? WHERE masize = ?`;

  db.query(sql, [size.trim(), masize], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật size:", err.message);
      return res.status(500).json({ message: "Lỗi server khi cập nhật size" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy size cần cập nhật" });
    }

    res.status(200).json({
      message: "Cập nhật size thành công",
      data: {
        masize,
        size: size.trim()
      }
    });
  });
};
//Xóa 1 size sản phẩm trong bảng sizesanpham có kiểm tra điều kiện, nếu đang sử dụng size đó thì không được xóa
exports.deleteSize = (req, res) => {
  const { masize } = req.params;

  // Kiểm tra size có đang được dùng trong bảng giasize không
  const checkGiaSizeSql = `SELECT COUNT(*) AS count FROM giasize WHERE masize = ?`;
  db.query(checkGiaSizeSql, [masize], (errGia, resultGia) => {
    if (errGia) {
      console.error("Lỗi kiểm tra giasize:", errGia.message);
      return res.status(500).json({ message: "Lỗi kiểm tra giasize" });
    }

    if (resultGia[0].count > 0) {
      return res.status(400).json({
        message: "Không thể xoá size vì đang được dùng trong bảng giá sản phẩm"
      });
    }

    // (Tùy hệ thống, nếu sizeproduct cũng quan trọng thì giữ lại)
    const checkSizeProductSql = `SELECT COUNT(*) AS count FROM sizeproduct WHERE masize = ?`;
    db.query(checkSizeProductSql, [masize], (errSP, resultSP) => {
      if (errSP) {
        console.error("Lỗi kiểm tra sizeproduct:", errSP.message);
        return res.status(500).json({ message: "Lỗi kiểm tra sizeproduct" });
      }

      if (resultSP[0].count > 0) {
        return res.status(400).json({
          message: "Không thể xoá size vì đang được dùng trong bảng sizeproduct"
        });
      }

      // Nếu không bị ràng buộc ở đâu → xoá size
      const deleteSql = `DELETE FROM sizesanpham WHERE masize = ?`;
      db.query(deleteSql, [masize], (errDel, resultDel) => {
        if (errDel) {
          console.error("Lỗi khi xoá size:", errDel.message);
          return res.status(500).json({ message: "Lỗi khi xoá size" });
        }

        if (resultDel.affectedRows === 0) {
          return res.status(404).json({ message: "Không tìm thấy size để xoá" });
        }

        res.status(200).json({
          message: "Xoá size thành công!",
          masize
        });
      });
    });
  });
};
