const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục Fe/public/img tồn tại
const uploadDir = path.join(__dirname, '../Fe/public/img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file vào Fe/public/img với tên file có timestamp tránh trùng
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận các file ảnh (jpeg, jpg, png, gif)'));
  }
});

// Export middleware upload.single('image') để dùng ở route
exports.uploadImageMiddleware = upload.single('image');
