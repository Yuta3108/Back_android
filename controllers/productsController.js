const db = require('../db');

// Lấy danh sách tất cả sản phẩm
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

// Xóa sản phẩm theo id
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

// Thống kê sản phẩm
exports.getProductStats = (req, res) => {
    const sqlStats = `
        SELECT 
            COUNT(*) AS total_products,
            SUM(price) AS total_price,
            AVG(price) AS average_price,
            MAX(price) AS max_price,
            MIN(price) AS min_price
        FROM products;
    `;
    const sqlByCategory = `
        SELECT category_id, COUNT(*) AS count
        FROM products
        GROUP BY category_id;
    `;

    db.query(sqlStats, (err1, statsResult) => {
        if (err1) {
            console.error("Lỗi thống kê sản phẩm:", err1.message);
            return res.status(500).json({ message: 'Lỗi server khi thống kê sản phẩm' });
        }
        db.query(sqlByCategory, (err2, categoryCounts) => {
            if (err2) {
                console.error("Lỗi thống kê theo danh mục:", err2.message);
                return res.status(500).json({ message: 'Lỗi server khi thống kê danh mục sản phẩm' });
            }
            res.status(200).json({
                total: statsResult[0],
                byCategory: categoryCounts
            });
        });
    });
};

// Lấy danh sách sản phẩm kèm size và giá
exports.getProductListWithSizes = (req, res) => {
    const sql = `
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            p.img AS image,
            c.name AS category_name,
            s.size AS size_name,
            gs.gia AS price
        FROM 
            products p
        JOIN 
            categories c ON p.category_id = c.id
        JOIN 
            sizeproduct msp ON p.id = msp.masanpham
        JOIN 
            sizesanpham s ON msp.masize = s.masize
        JOIN 
            giasize gs ON p.id = gs.masanpham AND s.masize = gs.masize
        ORDER BY 
            p.id, s.masize;
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Lỗi khi truy vấn sản phẩm có size:", err.message);
            return res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
        }
        res.status(200).json({ message: "Lấy danh sách sản phẩm kèm size thành công", data: result });
    });
};

// Thêm sản phẩm mới kèm size và giá
exports.addProductWithSizes = (req, res) => {
  const { name, category_id, sizes } = req.body;
  let sizesParsed = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

  if (!name || !category_id || !sizesParsed || !Array.isArray(sizesParsed)) {
    return res.status(400).json({ message: 'Dữ liệu gửi lên không hợp lệ' });
  }

  const imgPath = req.file ? req.file.filename : null;

  const insertProductSQL = `INSERT INTO products (name, category_id, img) VALUES (?, ?, ?)`;

  db.query(insertProductSQL, [name, category_id, imgPath], (err, productResult) => {
    if (err) {
      console.error("Lỗi khi thêm sản phẩm:", err.message);
      return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm' });
    }

    const masanpham = productResult.insertId;

    const sizeproductValues = sizesParsed.map(s => [masanpham, s.masize]);
    const giasizeValues = sizesParsed.map(s => [masanpham, s.masize, s.gia]);

    const insertSizeProductSQL = `INSERT INTO sizeproduct (masanpham, masize) VALUES ?`;
    const insertGiaSizeSQL = `INSERT INTO giasize (masanpham, masize, gia) VALUES ?`;

    db.query(insertSizeProductSQL, [sizeproductValues], (err1) => {
      if (err1) {
        console.error("Lỗi khi thêm size sản phẩm:", err1.message);
        return res.status(500).json({ message: 'Lỗi khi thêm size sản phẩm' });
      }

      db.query(insertGiaSizeSQL, [giasizeValues], (err2) => {
        if (err2) {
          console.error("Lỗi khi thêm giá size:", err2.message);
          return res.status(500).json({ message: 'Lỗi khi thêm giá theo size' });
        }

        res.status(201).json({ message: 'Thêm sản phẩm thành công' });
      });
    });
  });
};


// Cập nhật sản phẩm kèm size và giá
exports.updateProductWithSizes = (req, res) => {
    const { name, category_id, sizes } = req.body;
    const { id } = req.params;

    let sizesParsed;
    try {
        sizesParsed = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } catch {
        return res.status(400).json({ message: 'Dữ liệu size không hợp lệ' });
    }

    if (!name || !category_id || !sizesParsed || !Array.isArray(sizesParsed)) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin cần cập nhật' });
    }

    const updateProductSQL = `UPDATE products SET name = ?, category_id = ? WHERE id = ?`;
    db.query(updateProductSQL, [name, category_id, id], (err1) => {
        if (err1) {
            console.error("Lỗi khi cập nhật sản phẩm:", err1.message);
            return res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm' });
        }

        const deleteGiaSizeSQL = `DELETE FROM giasize WHERE masanpham = ?`;
        const deleteSizeProductSQL = `DELETE FROM sizeproduct WHERE masanpham = ?`;

        db.query(deleteGiaSizeSQL, [id], (err2) => {
            if (err2) return res.status(500).json({ message: 'Lỗi khi xoá giá size cũ' });

            db.query(deleteSizeProductSQL, [id], (err3) => {
                if (err3) return res.status(500).json({ message: 'Lỗi khi xoá size sản phẩm cũ' });

                const sizeproductValues = sizesParsed.map(s => [id, s.masize]);
                const giasizeValues = sizesParsed.map(s => [id, s.masize, s.gia]);

                const insertSizeSQL = `INSERT INTO sizeproduct (masanpham, masize) VALUES ?`;
                const insertGiaSQL = `INSERT INTO giasize (masanpham, masize, gia) VALUES ?`;

                db.query(insertSizeSQL, [sizeproductValues], (err4) => {
                    if (err4) return res.status(500).json({ message: 'Lỗi khi thêm size mới' });

                    db.query(insertGiaSQL, [giasizeValues], (err5) => {
                        if (err5) return res.status(500).json({ message: 'Lỗi khi thêm giá size mới' });

                        res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
                    });
                });
            });
        });
    });
};

// Xóa sản phẩm kèm size và giá
exports.deleteProductWithSizes = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Thiếu ID sản phẩm cần xoá' });

    const deleteGiaSizeSQL = `DELETE FROM giasize WHERE masanpham = ?`;
    const deleteSizeProductSQL = `DELETE FROM sizeproduct WHERE masanpham = ?`;
    const deleteProductSQL = `DELETE FROM products WHERE id = ?`;

    db.query(deleteGiaSizeSQL, [id], (err1) => {
        if (err1) {
            console.error('Lỗi khi xoá giá:', err1.message);
            return res.status(500).json({ message: 'Lỗi khi xoá giá theo size' });
        }

        db.query(deleteSizeProductSQL, [id], (err2) => {
            if (err2) {
                console.error('Lỗi khi xoá size:', err2.message);
                return res.status(500).json({ message: 'Lỗi khi xoá size sản phẩm' });
            }

            db.query(deleteProductSQL, [id], (err3) => {
                if (err3) {
                    console.error('Lỗi khi xoá sản phẩm:', err3.message);
                    return res.status(500).json({ message: 'Lỗi khi xoá sản phẩm chính' });
                }

                res.status(200).json({ message: 'Đã xoá sản phẩm và các size/giá liên quan' });
            });
        });
    });
};
