const db = require('../db');

// Lấy danh sách sản phẩm
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
// thêm 1 sản phẩm mới vào bảng
// exports.addProduct = (req, res) => {
//     const { name, price, category_id, img } = req.body;

//     if (!name || !price || !category_id) {
//         return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm' });
//     }

//     const sql = 'INSERT INTO products (name, price, category_id, img) VALUES (?, ?, ?, ?)';
//     db.query(sql, [name, price, category_id, img || null], (err, result) => {
//         if (err) {
//             console.error(' Lỗi thêm sản phẩm:', err);
//             return res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm' });
//         }

//         res.status(201).json({ message: ' Thêm sản phẩm thành công!', productId: result.insertId });
//     });
// };
//Xóa 1 sản phẩm dựa theo id
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

//Update sản phẩm theo id
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, price, category_id, img } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin cần cập nhật' });
    }

    const sql = `
        UPDATE products 
        SET name = ?, price = ?, category_id = ?, img = ?
        WHERE id = ?
    `;

    db.query(sql, [name, price, category_id, img || null, productId], (err, result) => {
        if (err) {
            console.error(' Lỗi cập nhật sản phẩm:', err);
            return res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        res.json({ message: ' Cập nhật sản phẩm thành công!' });
    });
};

// 📊 Thống kê sản phẩm
exports.getProductStats = (req, res) => {
    const sql = `
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

    // Thực hiện 2 truy vấn song song
    db.query(sql, (err1, statsResult) => {
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
                data: {
                    ...statsResult[0], // Thống kê chung
                    byCategory: categoryCounts // Thống kê theo danh mục
                }
            });
        });
    });
};
// API lấy tất cả của product (mã, tên sản phẩm, tên loại, tên size, giá theo size)
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

        res.status(200).json({
            message: "Lấy danh sách sản phẩm kèm size thành công",
            data: result
        });
    });
};


// API thêm product (mã, tên sản phẩm, tên loại, tên size, giá theo size)
exports.addProductWithSizes = (req, res) => {
    const { name, category_id, sizes } = req.body;

    const sizesParsed = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

    if (!name || !category_id || !sizesParsed || !Array.isArray(sizesParsed)) {
        return res.status(400).json({ message: 'Dữ liệu gửi lên không hợp lệ' });
    }

    const insertProductSQL = `
        INSERT INTO products (name, category_id) VALUES (?, ?)
    `;

    db.query(insertProductSQL, [name, category_id], (err, productResult) => {
        if (err) {
            console.error("Lỗi khi thêm sản phẩm:", err.message);
            return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm' });
        }

        const masanpham = productResult.insertId;

        const sizeproductValues = sizesParsed.map(s => [masanpham, s.masize]);
        const giasizeValues = sizesParsed.map(s => [masanpham, s.masize, s.gia]);

        const insertSizeProductSQL = `
            INSERT INTO sizeproduct (masanpham, masize) VALUES ?
        `;
        const insertGiaSizeSQL = `
            INSERT INTO giasize (masanpham, masize, gia) VALUES ?
        `;

        db.query(insertSizeProductSQL, [sizeproductValues], (err1) => {
            if (err1) {
                console.error("Lỗi khi thêm vào sizeproduct:", err1.message);
                return res.status(500).json({ message: 'Lỗi khi thêm size sản phẩm' });
            }

            db.query(insertGiaSizeSQL, [giasizeValues], (err2) => {
                if (err2) {
                    console.error("Lỗi khi thêm vào giasize:", err2.message);
                    return res.status(500).json({ message: 'Lỗi khi thêm giá theo size' });
                }

                return res.status(201).json({ message: 'Thêm sản phẩm thành công' });
            });
        });
    });
};
//API thêm 1 giá mới cho 1 size của 1 sản phẩm đã có sẵn  

exports.addSizeToExistingProduct = (req, res) => {
    const { masize, gia } = req.body;
    const masanpham = req.params.id;

    if (!masize || !gia) {
        return res.status(400).json({ message: 'Thiếu masize hoặc giá' });
    }

    // B1: Thêm vào bảng sizeproduct
    const insertSizeProduct = `INSERT INTO sizeproduct (masanpham, masize) VALUES (?, ?)`;
    db.query(insertSizeProduct, [masanpham, masize], (err1) => {
        if (err1) {
            console.error('Lỗi khi thêm size sản phẩm:', err1);
            return res.status(500).json({ message: 'Lỗi khi thêm size sản phẩm' });
        }

        // B2: Thêm vào bảng giasize
        const insertGiaSize = `INSERT INTO giasize (masanpham, masize, gia) VALUES (?, ?, ?)`;
        db.query(insertGiaSize, [masanpham, masize, gia], (err2) => {
            if (err2) {
                console.error('Lỗi khi thêm giá size:', err2);
                return res.status(500).json({ message: 'Lỗi khi thêm giá size' });
            }

            return res.status(201).json({ message: 'Thêm size và giá thành công' });
        });
    });
};

