-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 24, 2025 lúc 02:54 PM
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
-- Cơ sở dữ liệu: `Flutter`
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
