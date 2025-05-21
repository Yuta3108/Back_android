-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 21, 2025 lúc 03:02 PM
-- Phiên bản máy phục vụ: 8.3.0
-- Phiên bản PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `flutter`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Cà phê'),
(2, 'Trà sữa'),
(3, 'Sinh tố'),
(4, 'Nước giải khát'),
(7, 'đồ ăn, uống');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE IF NOT EXISTS `chitietdonhang` (
  `machitiet` int NOT NULL AUTO_INCREMENT,
  `madonhang` int NOT NULL,
  `masanpham` int NOT NULL,
  `tonggia` float NOT NULL,
  PRIMARY KEY (`machitiet`),
  KEY `madonhang` (`madonhang`,`masanpham`),
  KEY `FK_msanpham` (`masanpham`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`machitiet`, `madonhang`, `masanpham`, `tonggia`) VALUES
(6, 4, 1, 20000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietsanpham`
--

DROP TABLE IF EXISTS `chitietsanpham`;
CREATE TABLE IF NOT EXISTS `chitietsanpham` (
  `machitietsanpham` int NOT NULL AUTO_INCREMENT,
  `kichthuoc` varchar(10) NOT NULL,
  `trigia` int NOT NULL,
  `masp` int NOT NULL,
  PRIMARY KEY (`machitietsanpham`),
  KEY `masp` (`masp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

DROP TABLE IF EXISTS `donhang`;
CREATE TABLE IF NOT EXISTS `donhang` (
  `madonhang` int NOT NULL AUTO_INCREMENT,
  `ngaydat` date NOT NULL,
  `tongtien` float NOT NULL,
  `trangthai` varchar(50) NOT NULL,
  `ghichu` text NOT NULL,
  `phuongthucthanhtoan` varchar(10) NOT NULL,
  `soluong` int NOT NULL,
  `mauser` int NOT NULL,
  PRIMARY KEY (`madonhang`),
  KEY `mauser` (`mauser`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`madonhang`, `ngaydat`, `tongtien`, `trangthai`, `ghichu`, `phuongthucthanhtoan`, `soluong`, `mauser`) VALUES
(4, '2025-05-21', 20000, 'choxuly', 'ca phe den khong duong', 'cod', 1, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `salary` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `position`, `salary`, `created_at`) VALUES
(1, 'Nguyễn Văn B', 'a.nguyen@example.com', 'Quản lý', 15000000, '2025-04-05 02:14:41'),
(2, 'Trần Thị B', 'b.tran@example.com', 'Thu ngân', 8000000, '2025-04-05 02:14:41'),
(3, 'Lê Văn C', 'c.le@example.com', 'Thu Ngân', 9000000, '2025-04-05 02:14:41'),
(4, 'Phạm Thị D', 'd.pham@example.com', 'Thu Ngân', 7000000, '2025-04-05 02:14:41'),
(10, 'thanh sang', 'st857146@gmail.com', 'Quản lý', 5000000, '2025-05-20 12:36:01'),
(11, 'anh vien', 'anhvien1223@gmail.com', 'Làm mình làm mẩy', 100000, '2025-05-20 12:47:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giasize`
--

DROP TABLE IF EXISTS `giasize`;
CREATE TABLE IF NOT EXISTS `giasize` (
  `magiasize` int NOT NULL AUTO_INCREMENT,
  `masanpham` int NOT NULL,
  `masize` int NOT NULL,
  `gia` float NOT NULL,
  PRIMARY KEY (`magiasize`),
  KEY `masanpham` (`masanpham`,`masize`),
  KEY `FK_masize1` (`masize`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `giasize`
--

INSERT INTO `giasize` (`magiasize`, `masanpham`, `masize`, `gia`) VALUES
(1, 1, 1, 10000),
(2, 1, 2, 15000),
(3, 1, 3, 25000),
(4, 1, 5, 30000),
(5, 2, 1, 13000),
(6, 2, 2, 18000),
(7, 2, 3, 17500),
(8, 2, 5, 28000),
(9, 3, 1, 18000),
(10, 3, 2, 23000),
(11, 3, 3, 28000),
(12, 3, 5, 32000),
(13, 4, 1, 25000),
(14, 4, 2, 30000),
(15, 4, 3, 35000),
(16, 4, 5, 40000),
(17, 5, 1, 17500),
(18, 5, 2, 55000),
(19, 5, 3, 60000),
(20, 5, 5, 65000),
(21, 6, 1, 20000),
(22, 6, 2, 25000),
(23, 6, 3, 30000),
(24, 6, 5, 35000),
(25, 7, 1, 25000),
(26, 7, 2, 30000),
(27, 7, 3, 35000),
(28, 7, 5, 40000),
(29, 8, 1, 30000),
(30, 8, 2, 35000),
(31, 8, 3, 40000),
(32, 8, 5, 45000),
(33, 11, 1, 25000),
(34, 11, 2, 30000),
(35, 11, 3, 35000),
(36, 11, 5, 40000),
(37, 13, 1, 25000),
(38, 13, 2, 30000),
(39, 13, 3, 35000),
(40, 13, 5, 40000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `price` float NOT NULL,
  `category_id` int NOT NULL,
  `img` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category_id`, `img`) VALUES
(1, 'Cà phê đen', 10000, 1, 'img/cfden.jpg'),
(2, 'Cà phê sữa ', 13000, 1, 'img/cfsua.png'),
(3, 'Cà phê muối ngon hơn', 18000, 1, 'img/cfmuoi.jpg'),
(4, 'Cà phê sữa dừa ', 25000, 1, 'img/cfsuadua.jpg'),
(5, 'Cà phê chồn', 50000, 1, 'img/cfchon.jpg'),
(6, 'Trà sữa truyền thống', 20000, 2, 'img/trasuatt.jpg'),
(7, 'Trà sữa trân châu đường đen', 25000, 2, 'img/trasuatcdd.jpg'),
(8, 'Trà sữa Atisô', 30000, 2, 'img/trasuaatiso.jpg'),
(11, 'Sinh tố bơ', 25000, 3, 'img/stbo.jpg'),
(13, 'Sinh tố dưa lưới', 25000, 3, 'img/stdualuoi.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizeproduct`
--

DROP TABLE IF EXISTS `sizeproduct`;
CREATE TABLE IF NOT EXISTS `sizeproduct` (
  `masizeproduct` int NOT NULL AUTO_INCREMENT,
  `masize` int NOT NULL,
  `masanpham` int NOT NULL,
  PRIMARY KEY (`masizeproduct`),
  KEY `masizesanpham` (`masize`,`masanpham`),
  KEY `FK_masp` (`masanpham`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sizeproduct`
--

INSERT INTO `sizeproduct` (`masizeproduct`, `masize`, `masanpham`) VALUES
(1, 1, 1),
(5, 1, 2),
(9, 1, 3),
(13, 1, 4),
(17, 1, 5),
(21, 1, 6),
(25, 1, 7),
(29, 1, 8),
(33, 1, 11),
(42, 1, 13),
(2, 2, 1),
(6, 2, 2),
(10, 2, 3),
(14, 2, 4),
(18, 2, 5),
(22, 2, 6),
(26, 2, 7),
(30, 2, 8),
(34, 2, 11),
(43, 2, 13),
(3, 3, 1),
(7, 3, 2),
(11, 3, 3),
(15, 3, 4),
(19, 3, 5),
(23, 3, 6),
(27, 3, 7),
(31, 3, 8),
(35, 3, 11),
(44, 3, 13),
(4, 5, 1),
(8, 5, 2),
(12, 5, 3),
(16, 5, 4),
(20, 5, 5),
(24, 5, 6),
(28, 5, 7),
(32, 5, 8),
(36, 5, 11),
(45, 5, 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizesanpham`
--

DROP TABLE IF EXISTS `sizesanpham`;
CREATE TABLE IF NOT EXISTS `sizesanpham` (
  `masize` int NOT NULL AUTO_INCREMENT,
  `size` varchar(10) NOT NULL,
  PRIMARY KEY (`masize`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sizesanpham`
--

INSERT INTO `sizesanpham` (`masize`, `size`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(5, 'XL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `name` varchar(250) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `address`) VALUES
(3, 'san@gmail.com', '123', 'thanh san', '01234567899', '123 bong sao'),
(4, '6@gmail.com', '123', 'chu 6', '1234567897', '123 cau chu y');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `FK_mdh` FOREIGN KEY (`madonhang`) REFERENCES `donhang` (`madonhang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_msanpham` FOREIGN KEY (`masanpham`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chitietsanpham`
--
ALTER TABLE `chitietsanpham`
  ADD CONSTRAINT `FK_Msp` FOREIGN KEY (`masp`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `FK_Mauser` FOREIGN KEY (`mauser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `giasize`
--
ALTER TABLE `giasize`
  ADD CONSTRAINT `FK_masize1` FOREIGN KEY (`masize`) REFERENCES `sizeproduct` (`masize`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_msanpham1` FOREIGN KEY (`masanpham`) REFERENCES `sizeproduct` (`masanpham`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_idc` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sizeproduct`
--
ALTER TABLE `sizeproduct`
  ADD CONSTRAINT `FK_masize` FOREIGN KEY (`masize`) REFERENCES `sizesanpham` (`masize`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_masp` FOREIGN KEY (`masanpham`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
