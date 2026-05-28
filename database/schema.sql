-- phpMyAdmin SQL Dump
-- Host: 127.0.0.1
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Database: `aquashare`
-- --------------------------------------------------------

DROP DATABASE IF EXISTS `aquashare`;
CREATE DATABASE `aquashare` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aquashare`;

-- DROP TABLE IF EXISTS `message`;
-- DROP TABLE IF EXISTS `rating`;
-- DROP TABLE IF EXISTS `request`;
-- DROP TABLE IF EXISTS `supplier_profile`;
-- DROP TABLE IF EXISTS `resident_profile`;
-- DROP TABLE IF EXISTS `user`;

-- --------------------------------------------------------
-- Table: `user`
-- Shared table for all user types (resident, supplier, admin)
-- --------------------------------------------------------

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 08:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aquashare`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` varchar(20) NOT NULL DEFAULT 'resident'
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `password_hash`, `address`, `is_active`, `created_at`, `updated_at`, `role`) VALUES
(1, 'etta kirien', '675204747', 'ettajunior@gmail.com', '$2y$10$6ccKuHgzlyaZtNuoOYvCq.H5jk36NYWfi4Y4LtlkMsNPokfl7wnPG', 'malingo', 1, '2026-05-23 22:52:41', '2026-05-23 22:52:41', 'resident'),
(2, 'blaise', '675204745', 'blaise@gmail.com', '$2y$10$G/vdKzBkkfRwQQaIOZTfgeAAJcs9IOCTKMy53yi7dshhrU0nPq/s.', 'malingo', 1, '2026-05-23 22:57:00', '2026-05-23 22:57:00', 'resident'),
(3, 'ombiono', '658280804', 'ombionomuriel@gmail.com', '$2y$10$AosZ9DXcEdFNEZBpPibKiO.39yDugp1o.w1j57CIdHw2/xKlR8WVm', 'malingo', 1, '2026-05-23 23:34:08', '2026-05-24 05:08:23', 'resident'),
(4, 'brady', '658280805', 'john@gmail.com', '$2y$10$h4ksOjHrsNu4yjkjWYeM.eavvcCmkKfVvlfVovJGZi1DRWnVnPP9y', 'malingo', 1, '2026-05-23 23:37:12', '2026-05-23 23:37:12', 'resident'),
(5, 'John Doe', '1234567890', 'john@example.com', '$2y$10$bhOL6TTkpKUOo4mEYXeq.eu3yL/tiCfQzYsnCWF8yXeEswxXP4bTS', '123 Main Street', 1, '2026-05-24 00:02:58', '2026-05-24 05:55:43', 'resident'),
(6, 'mimi', '675004125', 'mimi@gmail.com', '$2y$10$vknmE1e7/BRjCBOO7I5mhe1V3w3XcpcRfsdzaY4CCuwr5w3HbV29u', 'buea', 1, '2026-05-24 05:13:57', '2026-05-24 05:26:27', 'resident'),
(7, 'Test User', '9999999999', 'test@example.com', '$2y$10$0ynnaPzfPNelj0szeSb.EepmpTOquh59ZdIxpBTebxBHoWdNuDw2i', '1 Test Street', 1, '2026-05-24 05:59:05', '2026-05-24 05:59:05', 'resident');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- --------------------------------------------------------
-- Table: `resident_profile`
-- Extra details for users with role = 'resident'
-- --------------------------------------------------------

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 04:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aquashare`
--

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_client_phone` (`phone`),
  ADD UNIQUE KEY `uk_client_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE `resident_profile` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address` varchar(255) NOT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_resident_user` (`user_id`),
  CONSTRAINT `fk_resident_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: `supplier_profile`
-- Extra details for users with role = 'supplier'
-- --------------------------------------------------------

CREATE TABLE `supplier_profile` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address` varchar(255) NOT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `price_per_unit` decimal(10,2) NOT NULL COMMENT 'Price per container/jerry can',
  `unit_description` varchar(100) NOT NULL DEFAULT '25L jerry can' COMMENT 'e.g. 25L jerry can, bucket',
  `delivery_available` tinyint(1) NOT NULL DEFAULT 1,
  `max_deliveries_per_day` tinyint(3) UNSIGNED DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Currently has water to supply',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_supplier_user` (`user_id`),
  CONSTRAINT `fk_supplier_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: `request`
-- Water requests sent by residents to suppliers
-- --------------------------------------------------------

CREATE TABLE `request` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `resident_id` int(10) UNSIGNED NOT NULL,
  `supplier_id` int(10) UNSIGNED NOT NULL,
  `status` enum('pending','accepted','rejected','completed','cancelled') NOT NULL DEFAULT 'pending',
  `note` text DEFAULT NULL COMMENT 'Optional initial message with the request',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_request_resident` (`resident_id`),
  KEY `idx_request_supplier` (`supplier_id`),
  CONSTRAINT `fk_request_resident` FOREIGN KEY (`resident_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: `rating`
-- Resident ratings for suppliers after completed requests
-- --------------------------------------------------------

CREATE TABLE `rating` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `resident_id` int(10) UNSIGNED NOT NULL,
  `supplier_id` int(10) UNSIGNED NOT NULL,
  `score` tinyint(1) UNSIGNED NOT NULL COMMENT '1 to 5',
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rating_resident_supplier` (`resident_id`, `supplier_id`) COMMENT 'One rating per resident per supplier',
  KEY `idx_rating_supplier` (`supplier_id`),
  CONSTRAINT `fk_rating_resident` FOREIGN KEY (`resident_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: `message`
-- In-app chat between resident and supplier, scoped to a request
-- --------------------------------------------------------

CREATE TABLE `message` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id` int(10) UNSIGNED NOT NULL,
  `sender_id` int(10) UNSIGNED NOT NULL,
  `type` enum('text','image','location') NOT NULL DEFAULT 'text',
  `body` text NOT NULL COMMENT 'Text content, image path, or JSON {lat, lng} for location',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_message_request` (`request_id`),
  KEY `idx_message_sender` (`sender_id`),
  CONSTRAINT `fk_message_request` FOREIGN KEY (`request_id`) REFERENCES `request` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
