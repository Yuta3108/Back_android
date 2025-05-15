require("dotenv").config({ path: "./.env" });
const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productsRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const orderDetailsRoutes = require('./routes/orderDetailsRoutes');
const sizeRoutes = require('./routes/sizesanphamRoutes');
const app = express();
app.use(express.json());
app.use(cors());

//  Kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error(" Lỗi kết nối MySQL:", err);
        process.exit(1);
    } else {
        console.log(" Kết nối MySQL thành công!");
    }
});

//  API Đăng ký tài khoản (Không mã hóa mật khẩu)
app.post("/register", (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
        return res.status(400).json({ msg: "Vui lòng nhập email và mật khẩu!" });
    }

    // Lưu vào MySQL (Không mã hóa)
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email.toLowerCase(), password], (err, result) => {
        if (err) {
            console.error("⚠️ Lỗi đăng ký:", err);
            return res.status(400).json({ msg: "Email đã tồn tại hoặc lỗi hệ thống!" });
        }
        res.status(201).json({ msg: "Đăng ký thành công!" });
    });
});
app.use(express.json());  //  Đảm bảo đọc được JSON
app.use(express.urlencoded({ extended: true }));  //  Đọc dữ liệu từ form


//  API Đăng nhập (Không kiểm tra mã hóa)
app.post("/api/login", (req, res) => {
    console.log("📥 Dữ liệu nhận được từ client:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    const query = "SELECT id, email, password FROM users WHERE LOWER(email) = LOWER(?)";

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(" Lỗi truy vấn MySQL:", err);
            return res.status(500).json({ error: "Lỗi server" });
        }

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

        res.json({ message: "Đăng nhập thành công!", token });
    });
});
//api nhân viên
app.use('/api/employees', employeeRoutes);
//api sản phẩm
app.use('/api/products', productRoutes);
//api danh mục sản phẩm
app.use('/api/categories', categoryRoutes);
//api đơn hàng
app.use('/api/orders', ordersRoutes);
//api chi tiết đơn hàng
app.use('/api/order-details', orderDetailsRoutes);
//api size sản phẩm
app.use('/api/sizesanpham', sizeRoutes);
//  Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server chạy trên cổng ${PORT}`));
