const db = require('../db');
const { sendOrderStatusChangedNotification } = require('../ThongBao'); // Đảm bảo đúng path

exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { trangthai } = req.body;

    if (!trangthai) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới' });
    }

    const sqlGetCurrentStatus = 'SELECT trangthai, mauser FROM donhang WHERE madonhang = ?';

    db.query(sqlGetCurrentStatus, [id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi khi truy vấn trạng thái hiện tại:', err);
            return res.status(500).json({ message: 'Lỗi server khi truy vấn đơn hàng' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const currentStatus = results[0].trangthai;
        const mauser = results[0].mauser;

        if (currentStatus === 'dathanhcong') {
            return res.status(400).json({
                message: 'Đơn hàng đã được giao thành công, không thể thay đổi trạng thái nữa'
            });
        }

        if (currentStatus === trangthai) {
            return res.status(200).json({ message: 'Trạng thái không thay đổi' });
        }

        const sqlUpdateStatus = 'UPDATE donhang SET trangthai = ? WHERE madonhang = ?';
        db.query(sqlUpdateStatus, [trangthai, id], async (err) => {
            if (err) {
                console.error('❌ Lỗi khi cập nhật trạng thái:', err);
                return res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
            }

            // 🔍 Lấy token từ bảng users
            const sqlGetToken = 'SELECT token FROM users WHERE id = ?';
            db.query(sqlGetToken, [mauser], async (err, tokenResults) => {
                if (err) {
                    console.error('❌ Lỗi khi lấy token người dùng:', err);
                    return res.status(500).json({ message: 'Cập nhật thành công nhưng không gửi được thông báo' });
                }

                const token = tokenResults[0]?.token;
                if (token) {
                    try {
                        await sendOrderStatusChangedNotification(token, trangthai, id);
                        console.log('✅ Đã gửi thông báo trạng thái đơn hàng');
                    } catch (notifyErr) {
                        console.error('❌ Gửi thông báo thất bại:', notifyErr);
                        // Không return lỗi, vẫn báo thành công vì DB đã cập nhật rồi
                    }
                } else {
                    console.warn('⚠️ Không tìm thấy token của người dùng');
                }

                return res.json({ message: 'Cập nhật trạng thái thành công' });
            });
        });
    });
};

// Lấy tất cả đơn hàng
exports.getAllOrders = (req, res) => {
    const sql = 'SELECT * FROM donhang ORDER BY madonhang DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
        }
        res.json(results);
    });
};

// Thêm một đơn hàng mới
exports.createOrder = (req, res) => {
    const { tongtien, ghichu, phuongthucthanhtoan, soluong, mauser } = req.body;
    const ngaydat = new Date().toISOString().slice(0, 10);
    const trangthai = 'choxuly';

    console.log("Nhận request:", req.body); // 👈 In xem có vào đây không

    if (!tongtien || !phuongthucthanhtoan || !soluong || !mauser) {
        console.log("Thiếu dữ liệu");
        return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }

    const sql = `
        INSERT INTO donhang (ngaydat, tongtien, trangthai, ghichu, phuongthucthanhtoan, soluong, mauser)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [ngaydat, tongtien, trangthai, ghichu || '', phuongthucthanhtoan, soluong, mauser];

    console.log("Thực thi query:", sql, values); // 👈 In query để debug

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Lỗi khi thêm đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi thêm đơn hàng' });
        }

        console.log("Tạo đơn hàng thành công, id:", result.insertId); // 👈 In để xác nhận
        res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', id: result.insertId });
    });
};

// Xóa đơn hàng theo ID
exports.deleteOrder = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM donhang WHERE madonhang = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa đơn hàng:", err);
            return res.status(500).json({ message: 'Lỗi server khi xóa đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
        }

        res.json({ message: 'Xóa đơn hàng thành công' });
    });
};

// Cập nhật trạng thái đơn hàng (có điều kiện)
// exports.updateOrderStatus = (req, res) => {
//     const { id } = req.params;
//     const { trangthai } = req.body;

//     if (!trangthai) {
//         return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới' });
//     }

//     const sqlGetCurrentStatus = 'SELECT trangthai FROM donhang WHERE madonhang = ?';

//     db.query(sqlGetCurrentStatus, [id], (err, results) => {
//         if (err) {
//             console.error('Lỗi khi truy vấn trạng thái hiện tại:', err);
//             return res.status(500).json({ message: 'Lỗi server khi truy vấn đơn hàng' });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
//         }

//         const currentStatus = results[0].trangthai;

//         // Nếu trạng thái hiện tại là "dathanhcong" thì không cho phép cập nhật nữa
//         if (currentStatus === 'dathanhcong') {
//             return res.status(400).json({
//                 message: 'Đơn hàng đã được giao thành công, không thể thay đổi trạng thái nữa'
//             });
//         }

//         // Nếu không thay đổi gì thì không cần update
//         if (currentStatus === trangthai) {
//             return res.status(200).json({ message: 'Trạng thái không thay đổi' });
//         }

//         // Thực hiện cập nhật trạng thái
//         const sqlUpdateStatus = 'UPDATE donhang SET trangthai = ? WHERE madonhang = ?';
//         db.query(sqlUpdateStatus, [trangthai, id], (err) => {
//             if (err) {
//                 console.error('Lỗi khi cập nhật trạng thái:', err);
//                 return res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
//             }

//             res.json({ message: 'Cập nhật trạng thái thành công' });
//         });
//     });
// };
exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { trangthai } = req.body;

    if (!trangthai) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới' });
    }

    const sqlGetCurrentStatus = 'SELECT trangthai, mauser FROM donhang WHERE madonhang = ?';

    db.query(sqlGetCurrentStatus, [id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi khi truy vấn trạng thái hiện tại:', err);
            return res.status(500).json({ message: 'Lỗi server khi truy vấn đơn hàng' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const currentStatus = results[0].trangthai;
        const mauser = results[0].mauser;

        if (currentStatus === 'dathanhcong') {
            return res.status(400).json({
                message: 'Đơn hàng đã được giao thành công, không thể thay đổi trạng thái nữa'
            });
        }

        if (currentStatus === trangthai) {
            return res.status(200).json({ message: 'Trạng thái không thay đổi' });
        }

        const sqlUpdateStatus = 'UPDATE donhang SET trangthai = ? WHERE madonhang = ?';
        db.query(sqlUpdateStatus, [trangthai, id], async (err) => {
            if (err) {
                console.error('❌ Lỗi khi cập nhật trạng thái:', err);
                return res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
            }

            // 🔍 Lấy device_token từ bảng users
            const sqlGetToken = 'SELECT device_token FROM users WHERE id = ?';
            db.query(sqlGetToken, [mauser], async (err, tokenResults) => {
                if (err) {
                    console.error('❌ Lỗi khi lấy token người dùng:', err);
                    return res.status(500).json({ message: 'Cập nhật thành công nhưng không gửi được thông báo' });
                }

                const token = tokenResults[0]?.device_token;
                if (token) {
                    try {
                        await sendOrderStatusChangedNotification(token, trangthai, id);
                        console.log('✅ Đã gửi thông báo trạng thái đơn hàng');
                    } catch (notifyErr) {
                        console.error('❌ Gửi thông báo thất bại:', notifyErr);
                        // Không return lỗi, vẫn báo thành công vì DB đã cập nhật rồi
                    }
                } else {
                    console.warn('⚠️ Không tìm thấy device_token của người dùng');
                }

                return res.json({ message: 'Cập nhật trạng thái thành công' });
            });
        });
    });
};



// Xóa chi tiết đơn hàng theo machitiet
exports.deleteOrderDetail = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM chitietdonhang WHERE machitiet = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa chi tiết đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server khi xóa chi tiết đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng để xóa' });
        }

        res.json({ message: 'Xóa chi tiết đơn hàng thành công' });
    });
};

// 📦 Thống kê đơn hàng
exports.getOrderStats = (req, res) => {
    const sqlGeneral = `
        SELECT 
            COUNT(*) AS total_orders,
            SUM(tongtien) AS total_revenue,
            AVG(tongtien) AS average_order_value,
            MAX(tongtien) AS max_order_value,
            MIN(tongtien) AS min_order_value
        FROM donhang;
    `;

    const sqlByStatus = `
        SELECT trangthai, COUNT(*) AS count
        FROM donhang
        GROUP BY trangthai;
    `;

    const sqlByPayment = `
        SELECT phuongthucthanhtoan, COUNT(*) AS count
        FROM donhang
        GROUP BY phuongthucthanhtoan;
    `;

    db.query(sqlGeneral, (err1, generalStats) => {
        if (err1) {
            console.error('Lỗi khi thống kê đơn hàng:', err1);
            return res.status(500).json({ message: 'Lỗi server khi thống kê đơn hàng' });
        }

        db.query(sqlByStatus, (err2, statusStats) => {
            if (err2) {
                console.error('Lỗi thống kê theo trạng thái:', err2);
                return res.status(500).json({ message: 'Lỗi server khi thống kê trạng thái đơn hàng' });
            }

            db.query(sqlByPayment, (err3, paymentStats) => {
                if (err3) {
                    console.error('Lỗi thống kê phương thức thanh toán:', err3);
                    return res.status(500).json({ message: 'Lỗi server khi thống kê phương thức thanh toán' });
                }

                res.status(200).json({
                    data: {
                        ...generalStats[0],
                        byStatus: statusStats,
                        byPayment: paymentStats
                    }
                });
            });
        });
    });
};

//API lấy đơn hàng và chi tiết đơn hàng: 
exports.getAllOrders = (req, res) => {
    const sql = `
        SELECT 
            d.madonhang,
            d.ngaydat,
            d.tongtien,
            d.trangthai,
            d.ghichu,
            d.phuongthucthanhtoan,
            u.id AS user_id,
            u.name AS ten_khach_hang,
            p.id AS product_id,
            p.name AS ten_san_pham,
            ctdh.soluong
        FROM donhang d
        JOIN chitietdonhang ctdh ON d.madonhang = ctdh.madonhang
        JOIN products p ON ctdh.masanpham = p.id
        JOIN users u ON d.mauser = u.id
        ORDER BY d.ngaydat DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Lỗi khi lấy tất cả đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có đơn hàng nào' });
        }

        // Gom lại theo đơn hàng
        const ordersMap = {};

        results.forEach(row => {
            const {
                madonhang,
                ngaydat,
                tongtien,
                trangthai,
                ghichu,
                phuongthucthanhtoan,
                user_id,
                ten_khach_hang,
                product_id,
                ten_san_pham,
                soluong
            } = row;

            if (!ordersMap[madonhang]) {
                ordersMap[madonhang] = {
                    madonhang,
                    ngaydat,
                    tongtien,
                    trangthai,
                    ghichu,
                    phuongthucthanhtoan,
                    user: {
                        id: user_id,
                        name: ten_khach_hang
                    },
                    chitiet: []
                };
            }

            ordersMap[madonhang].chitiet.push({
                product_id,
                ten_san_pham,
                soluong
            });
        });

        const orders = Object.values(ordersMap);
        res.json(orders);
    });
};


// Lấy danh sách đơn hàng theo mã user
exports.getOrdersByUser = (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT 
            madonhang,
            ngaydat,
            tongtien,
            trangthai,
            ghichu,
            phuongthucthanhtoan,
            soluong
        FROM donhang
        WHERE mauser = ?
        ORDER BY ngaydat DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có đơn hàng nào' });
        }

        res.json(results);
    });
};
