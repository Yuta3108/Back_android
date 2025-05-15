const mysql = require('mysql2');
require("dotenv").config({ path: "./dtb.env" });

// 📌 Kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error(" Lỗi kết nối MySQL:", err);
        process.exit(1); // dừng server nếu kết nối lỗi
    } else {
        console.log(" Kết nối MySQL thành công!");
    }
});

module.exports = db;