-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 14, 2025 lúc 08:52 AM
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Cà phê'),
(2, 'Trà sữa'),
(3, 'Sinh tố'),
(4, 'Nước giải khát');

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
  `nguoitao` varchar(100) NOT NULL,
  PRIMARY KEY (`madonhang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category_id`, `img`) VALUES
(1, 'Cà phê đen', 10000, 1, ''),
(2, 'Cà phê sữa ', 13000, 1, ''),
(3, 'Cà phê muối', 15000, 1, ''),
(4, 'Cà phê sữa dừa ', 25000, 1, ''),
(5, 'Cà phê chồn', 50000, 1, ''),
(6, 'Trà sữa truyền thống', 20000, 2, ''),
(7, 'Trà sữa trân châu đường đen', 25000, 2, ''),
(8, 'Trà sữa Atisô', 30000, 2, ''),
(11, 'Sinh tố bơ', 25000, 3, ''),
(13, 'Sinh tố dưa lưới', 25000, 3, ''),
(16, 'Bò húc', 13000, 4, ''),
(17, 'Nước suối', 10000, 4, ''),
(20, 'Trà ôlong', 12000, 4, '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizesanpham`
--

DROP TABLE IF EXISTS `sizesanpham`;
CREATE TABLE IF NOT EXISTS `sizesanpham` (
  `masize` int NOT NULL AUTO_INCREMENT,
  `size` varchar(10) NOT NULL,
  `gia` float NOT NULL,
  `masanpham` int NOT NULL,
  PRIMARY KEY (`masize`),
  KEY `masanpham` (`masanpham`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sizesanpham`
--

INSERT INTO `sizesanpham` (`masize`, `size`, `gia`, `masanpham`) VALUES
(1, 'S', 10000, 1),
(2, 'M', 15000, 1),
(3, 'L', 20000, 1),
(4, 'S', 18000, 2),
(5, 'M', 23000, 2),
(6, 'L', 28000, 2),
(7, 'S', 15000, 3),
(8, 'M', 20000, 3),
(9, 'L', 25000, 3),
(10, 'S', 25000, 4),
(11, 'M', 30000, 4),
(12, 'L', 35000, 4),
(13, 'S', 50000, 5),
(14, 'M', 55000, 5),
(15, 'L', 60000, 5),
(16, 'S', 20000, 6),
(17, 'M', 25000, 6),
(18, 'L', 30000, 6),
(19, 'S', 25000, 7),
(20, 'M', 30000, 7),
(21, 'L', 35000, 7),
(22, 'S', 30000, 8),
(23, 'M', 35000, 8),
(24, 'L', 40000, 8),
(25, 'S', 25000, 11),
(26, 'M', 30000, 11),
(27, 'L', 30000, 11),
(28, 'S', 25000, 13),
(29, 'M', 30000, 13),
(30, 'L', 35000, 13);

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
-- Các ràng buộc cho bảng `sizesanpham`
--
ALTER TABLE `sizesanpham`
  ADD CONSTRAINT `FK_Mspsize` FOREIGN KEY (`masanpham`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
