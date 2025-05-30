const db = require('../db');
const path = require('path');
const fs = require('fs');

// 🔹 Lấy tất cả combo kèm sản phẩm + size
exports.getCombos = (req, res) => {
  const comboSQL = "SELECT * FROM combos";

  db.query(comboSQL, (err, combos) => {
    if (err) {
      console.error("❌ Lỗi khi lấy combos:", err);
      return res.status(500).json({ message: "Lỗi server khi lấy combo" });
    }

    if (combos.length === 0) return res.json([]);

    const result = [];
    let pending = combos.length;

    combos.forEach(combo => {
      const comboId = combo.id;

      const detailSQL = `
         SELECT 
          p.id AS product_id,
          p.name AS product_name,
          p.img AS product_img,
          s.masize AS size_id,
          s.size AS size_name,
          cps.quantity,
          gs.gia AS price
        FROM combo_products cps
        JOIN products p ON cps.product_id = p.id
        JOIN sizesanpham s ON cps.size_id = s.masize
        LEFT JOIN giasize gs ON p.id = gs.masanpham AND s.masize = gs.masize
        WHERE cps.combo_id = ?
      `;

      db.query(detailSQL, [comboId], (err2, items) => {
        if (err2) {
          console.error("❌ Lỗi khi lấy chi tiết combo:", err2);
          return res.status(500).json({ message: "Lỗi lấy chi tiết combo" });
        }

        result.push({ ...combo, items });
        pending--;

        if (pending === 0) {
          res.json(result);
        }
      });
    });
  });
};

// 🔹 Tạo combo mới
exports.createCombo = (req, res) => {
  const { name, price, items } = req.body;

  console.log('📥 req.body:', req.body);
  console.log('📥 items raw:', items);

  let parsedItems;
  try {
    parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
  } catch (err) {
    console.error('❌ Lỗi khi parse items:', err);
    return res.status(400).json({ message: 'Dữ liệu items không hợp lệ' });
  }

  console.log('✅ parsedItems:', parsedItems);

  if (!name || !price || !Array.isArray(parsedItems) || parsedItems.length === 0) {
    console.warn('❌ Dữ liệu combo không hợp lệ:', { name, price, parsedItems });
    return res.status(400).json({ message: 'Dữ liệu combo không hợp lệ' });
  }

  const img = req.file ? req.file.filename : null;

  const comboSQL = "INSERT INTO combos (name, price, img) VALUES (?, ?, ?)";
  db.query(comboSQL, [name, price, img], (err, result) => {
    if (err) {
      console.error("❌ Lỗi tạo combo:", err);
      return res.status(500).json({ message: "Lỗi khi tạo combo" });
    }

    const comboId = result.insertId;
    const values = parsedItems.map(item => [comboId, item.product_id, item.size_id, item.quantity]);

    console.log('📦 Giá trị insert vào combo_products:', values);

    const insertDetailSQL = `
      INSERT INTO combo_products (combo_id, product_id, size_id, quantity) VALUES ?
    `;
    db.query(insertDetailSQL, [values], (err2) => {
      if (err2) {
        console.error("❌ Lỗi thêm sản phẩm combo:", err2);
        return res.status(500).json({ message: "Lỗi khi thêm sản phẩm combo" });
      }

      res.status(201).json({ message: "✅ Tạo combo thành công", comboId });
    });
  });
};


// 🔹 Xoá combo
exports.deleteCombo = (req, res) => {
  const comboId = req.params.id;

  db.query("DELETE FROM combos WHERE id = ?", [comboId], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi xóa combo:", err);
      return res.status(500).json({ message: "Lỗi khi xóa combo" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy combo để xóa" });
    }

    res.json({ message: "✅ Đã xóa combo thành công" });
  });
};

// 🔹 Cập nhật combo
exports.updateCombo = (req, res) => {
  const { id } = req.params;
  const { name, price, items } = req.body;

  let parsedItems;
  try {
    parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
  } catch {
    return res.status(400).json({ message: 'Dữ liệu items không hợp lệ' });
  }

  if (!name || !price || !Array.isArray(parsedItems)) {
    return res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ' });
  }

  const img = req.file ? req.file.filename : null;

  // Nếu có ảnh mới thì cập nhật ảnh, không thì giữ nguyên ảnh cũ
  const updateComboSQL = img
    ? "UPDATE combos SET name = ?, price = ?, img = ? WHERE id = ?"
    : "UPDATE combos SET name = ?, price = ? WHERE id = ?";

  const params = img ? [name, price, img, id] : [name, price, id];

  db.query(updateComboSQL, params, (err1) => {
    if (err1) {
      console.error("❌ Lỗi cập nhật combo:", err1);
      return res.status(500).json({ message: "Lỗi khi cập nhật combo" });
    }

    const deleteOld = "DELETE FROM combo_products WHERE combo_id = ?";
    db.query(deleteOld, [id], (err2) => {
      if (err2) {
        console.error("❌ Lỗi xoá chi tiết combo cũ:", err2);
        return res.status(500).json({ message: "Lỗi khi xóa chi tiết combo" });
      }

      const values = parsedItems.map(item => [id, item.product_id, item.size_id, item.quantity]);
      const insertNew = `
        INSERT INTO combo_products (combo_id, product_id, size_id, quantity) VALUES ?
      `;
      db.query(insertNew, [values], (err3) => {
        if (err3) {
          console.error("❌ Lỗi thêm chi tiết combo mới:", err3);
          return res.status(500).json({ message: "Lỗi khi thêm chi tiết combo mới" });
        }

        res.status(200).json({ message: "✅ Cập nhật combo thành công" });
      });
    });
  });
};
