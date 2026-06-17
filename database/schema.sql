-- AquaShare Database Schema


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `aquashare`;
CREATE DATABASE `aquashare` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aquashare`;

-- --------------------------------------------------------
-- Table: `users`
-- Shared table for all user types (resident, supplier, admin)
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` varchar(20) NOT NULL DEFAULT 'resident',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: `resident_profile`
-- Extra details for users with role = 'resident'
-- --------------------------------------------------------

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
  `price_per_unit` decimal(10,2) NOT NULL DEFAULT 500 COMMENT 'Price per container/jerry can',
  `unit_description` varchar(100) NOT NULL DEFAULT '25L jerry can',
  `delivery_available` tinyint(1) NOT NULL DEFAULT 1,
  `max_deliveries_per_day` tinyint(3) UNSIGNED DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Currently has water to supply',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Admin verification status',
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
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
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

-- --------------------------------------------------------
-- Dummy Data for Testing (Insert into function)
-- Password for all dummy users is: password123
-- --------------------------------------------------------

-- Insert Users (Admin, Resident, Supplier)
INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `password_hash`, `address`, `is_active`, `role`) VALUES
(1, 'Admin User', '111111111', 'admin@aquashare.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin HQ', 1, 'admin'),
(2, 'Resident John', '222222222', 'john@resident.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Main St, Buea', 1, 'resident'),
(3, 'Supplier Mike', '333333333', 'mike@water.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Water Works, Buea', 1, 'supplier');

-- Insert Profiles
INSERT INTO `resident_profile` (`user_id`, `address`, `landmark`) VALUES
(2, '123 Main St, Buea', 'Near the big tree');

INSERT INTO `supplier_profile` (`user_id`, `address`, `price_per_unit`, `unit_description`, `is_available`, `whatsapp`) VALUES
(3, 'Water Works, Buea', 500.00, '25L jerry can', 1, '333333333');

COMMIT;
