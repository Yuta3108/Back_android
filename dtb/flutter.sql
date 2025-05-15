-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 15, 2025 lúc 02:42 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`machitiet`, `madonhang`, `masanpham`, `tonggia`) VALUES
(1, 1, 1, 10000),
(5, 1, 2, 15000);

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
  PRIMARY KEY (`madonhang`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`madonhang`, `ngaydat`, `tongtien`, `trangthai`, `ghichu`, `phuongthucthanhtoan`, `soluong`) VALUES
(1, '2025-05-14', 10000, 'dathanhcong', '', 'cod', 1);

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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `position`, `salary`, `created_at`) VALUES
(1, 'Nguyễn Văn A', 'a.nguyen@example.com', 'Quản lý', 15000000, '2025-04-05 02:14:41'),
(2, 'Trần Thị B', 'b.tran@example.com', 'Thu ngân', 8000000, '2025-04-05 02:14:41'),
(3, 'Lê Văn C', 'c.le@example.com', 'Thu Ngân', 9000000, '2025-04-05 02:14:41'),
(4, 'Phạm Thị D', 'd.pham@example.com', 'Thu Ngân', 7000000, '2025-04-05 02:14:41'),
(9, 'Nguyễn Văn L', 'nguyenvana@gmail.com', 'Phục Vụ', 10000000, '2025-04-05 02:56:54');

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(1, 'admin@gmail.com', '123456'),
(2, 'nguyenvana@example.com', 'password123'),
(3, 'tranthib@example.com', '12345678'),
(4, 'levanc@example.com', 'admin123'),
(5, 'phamthid@example.com', 'qwerty'),
(6, 'hoangvane@example.com', 'letmein'),
(7, 'test@example.com', '123456'),
(8, 'toysignupscreen@gmail.com', '123456'),
(9, 'toyotran@gmail.com', '123456'),
(10, 'toyotran12@gmail.com', '123456'),
(11, 'toyotran32@gmail.com', '123456'),
(12, 'toyotran44@gmail.com', '123456'),
(13, 'san@gmail.com', '123456');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `FK_mdonhang` FOREIGN KEY (`madonhang`) REFERENCES `donhang` (`madonhang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_msanpham` FOREIGN KEY (`masanpham`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chitietsanpham`
--
ALTER TABLE `chitietsanpham`
  ADD CONSTRAINT `FK_Msp` FOREIGN KEY (`masp`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
