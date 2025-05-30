require("dotenv").config({ path: "./.env" });
const path = require('path');
const express = require("express");
const mysql = require("mysql2/promise");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {
  sendOrderPlacedNotification,
  sendOrderStatusChangedNotification,
} = require("./ThongBao");

const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productsRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const orderDetailsRoutes = require('./routes/orderDetailsRoutes');
const sizeRoutes = require('./routes/sizesanphamRoutes');
const usersRoutes = require('./routes/usersRoutes');
const tableRoutes = require('./routes/tableRoutes');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('img'));

// Tạo IIFE để dùng async/await
(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("✅ Kết nối MySQL thành công!");

  // Đăng ký tài khoản
  app.post("/register", async (req, res) => {
    const { email, password, name, phone, address } = req.body;
    if (!email || !password || !name || !phone || !address) {
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin!" });
    }

    try {
      await db.query(
        `INSERT INTO users (email, password, name, phone, address) VALUES (?, ?, ?, ?, ?)`,
        [email.toLowerCase(), password, name, phone, address]
      );
      res.status(201).json({ msg: "Đăng ký thành công!" });
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      res.status(400).json({ msg: "Email đã tồn tại hoặc lỗi hệ thống!" });
    }
  });

  // Đăng nhập
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    try {
      const [results] = await db.query(
        "SELECT id, email, password FROM users WHERE LOWER(email) = LOWER(?)",
        [email]
      );

      if (results.length === 0) {
        return res.status(401).json({ message: "Email không tồn tại!" });
      }

      const user = results[0];
      if (password !== user.password) {
        return res.status(401).json({ message: "Sai mật khẩu!" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Đăng nhập thành công!", token, userId: user.id });
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  });

  // Lưu device token
  app.post("/api/user/device-token", async (req, res) => {
    const { userId, deviceToken } = req.body;
    try {
      await db.query("UPDATE users SET device_token = ? WHERE id = ?", [deviceToken, userId]);
      res.json({ success: true });
    } catch (error) {
      console.error("❌ Lỗi khi lưu device token:", error);
      res.status(500).json({ success: false, message: "Không thể lưu device token" });
    }
  });
  app.post("/api/send-order-notification", async (req, res) => {
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({ message: "Thiếu deviceToken" });
    }

    try {
      await sendOrderPlacedNotification(deviceToken);
      res.status(200).json({ message: "Đã gửi thông báo đặt hàng thành công" });
    } catch (err) {
      console.error("❌ Gửi thông báo thất bại:", err);
      res.status(500).json({ message: "Lỗi khi gửi thông báo" });
    }
  });
  // Gửi thông báo cập nhật trạng thái đơn hàng
  app.put("/order/:id/status", async (req, res) => {
    const madonhang = req.params.id;
    const { newStatus, deviceToken } = req.body;

    try {
      const [rows] = await db.query("SELECT * FROM donhang WHERE madonhang = ?", [madonhang]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "❌ Đơn hàng không tồn tại" });
      }

      // Cập nhật trạng thái đơn hàng trong DB
      await db.query("UPDATE donhang SET trangthai = ? WHERE madonhang = ?", [newStatus, madonhang]);

      // Gửi thông báo FCM
      await sendOrderStatusChangedNotification(deviceToken, newStatus, madonhang);

      res.json({ success: true });
    } catch (error) {
      console.error("❌ Gửi thông báo thất bại:", error);
      res.status(500).json({ error: "Không gửi được thông báoa" });
    }
  });





app.use('/api', tableRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file ảnh upload (thư mục 'img')
app.use('/img', express.static(path.join(__dirname, 'Fe/public/img')));

const comboRoutes = require('./routes/comboRoutes');
app.use('/api/combos', comboRoutes);

// Gắn các router phụ
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/order-details', orderDetailsRoutes);
app.use('/api/size', sizeRoutes);
app.use('/api', usersRoutes);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
})();
