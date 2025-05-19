const db = require('../db');

// Lấy danh sách nhân viên
exports.getAllEmployees = (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
};

// Thêm nhân viên mới
exports.addEmployee = (req, res) => {
  const { name, email, position, salary } = req.body;

  if (!name || !email || !position || !salary) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin nhân viên' });
  }

  const sql = 'INSERT INTO employees (name, email, position, salary) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, position, salary], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email đã tồn tại, vui lòng chọn email khác' });
      }
      console.error("Lỗi khi thêm nhân viên:", err);
      return res.status(500).json({ message: 'Lỗi server khi thêm nhân viên' });
    }
    res.status(201).json({ message: 'Thêm nhân viên thành công', id: result.insertId });
  });
};

// Cập nhật nhân viên
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, position, salary } = req.body;

  if (!name || !email || !position || !salary) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  const sql = 'UPDATE employees SET name = ?, email = ?, position = ?, salary = ? WHERE id = ?';
  db.query(sql, [name, email, position, salary, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email đã tồn tại' });
      }
      console.error("Lỗi khi cập nhật:", err);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Cập nhật nhân viên thành công' });
  });
};

// Xoá nhân viên
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM employees WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xoá:", err);
      return res.status(500).json({ message: 'Lỗi server khi xoá' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Xoá nhân viên thành công' });
  });
};


// 📊 Thống kê đầy đủ thông tin nhân viên
exports.getEmployeeStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_employees,
      SUM(salary) AS total_salary,
      AVG(salary) AS average_salary,
      MAX(salary) AS max_salary,
      MIN(salary) AS min_salary
    FROM employees
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi thống kê nhân viên:", err.message);
      return res.status(500).json({ message: 'Lỗi server khi thống kê nhân viên' });
    }

    res.status(200).json({
      data: results[0], // vì chỉ có 1 dòng kết quả
    });
  });
};