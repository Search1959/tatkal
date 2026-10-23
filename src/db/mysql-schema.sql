-- =====================================================================
-- Tatkal Assist: Production MySQL 8.0+ Schema & Migration Script
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Engine: InnoDB with Foreign Key Constraints & Performance Indexes
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `tatkal_assist` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `tatkal_assist`;

-- ---------------------------------------------------------------------
-- 1. Users and Authentication Sessions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `phone_number` VARCHAR(15) NULL UNIQUE,
  `email` VARCHAR(255) NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `preferred_language` ENUM('en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn') DEFAULT 'en',
  `role` ENUM('USER', 'ADMIN', 'MODERATOR') DEFAULT 'USER',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_phone` (`phone_number`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `auth_sessions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `refresh_token_hash` VARCHAR(255) NOT NULL,
  `user_agent` VARCHAR(512) NULL,
  `ip_address` VARCHAR(45) NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `revoked_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_sessions_user` (`user_id`),
  INDEX `idx_sessions_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Stations Reference Data
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stations` (
  `code` VARCHAR(10) NOT NULL PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `state` VARCHAR(80) NOT NULL,
  `zone` VARCHAR(10) NOT NULL,
  `is_junction` BOOLEAN DEFAULT FALSE,
  `latitude` DECIMAL(9,6) NULL,
  `longitude` DECIMAL(9,6) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_stations_city` (`city`),
  INDEX `idx_stations_name` (`name`),
  INDEX `idx_stations_zone` (`zone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Passenger Profiles (Master List)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `passenger_profiles` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `age` TINYINT UNSIGNED NOT NULL,
  `gender` ENUM('M', 'F', 'T') NOT NULL,
  `berth_preference` ENUM('NO_PREF', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW') DEFAULT 'NO_PREF',
  `food_preference` ENUM('V', 'N', 'NONE') DEFAULT 'NONE',
  `senior_citizen` BOOLEAN DEFAULT FALSE,
  `group_tag` VARCHAR(50) DEFAULT 'Family',
  `id_card_type` VARCHAR(40) NULL,
  `id_card_last4` VARCHAR(4) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_passengers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_passengers_user` (`user_id`),
  INDEX `idx_passengers_group` (`user_id`, `group_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Saved Journeys & Tatkal Calculations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `saved_journeys` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `train_number` VARCHAR(10) NOT NULL,
  `train_name` VARCHAR(150) NOT NULL,
  `from_station_code` VARCHAR(10) NOT NULL,
  `to_station_code` VARCHAR(10) NOT NULL,
  `journey_date` DATE NOT NULL,
  `travel_class` VARCHAR(5) NOT NULL,
  `quota` VARCHAR(5) DEFAULT 'TQ',
  `origin_departure_offset_days` TINYINT UNSIGNED DEFAULT 0,
  `tatkal_opening_date` DATE NOT NULL,
  `tatkal_opening_time` TIME NOT NULL,
  `is_ac_class` BOOLEAN NOT NULL,
  `reminder_enabled` BOOLEAN DEFAULT TRUE,
  `reminder_minutes_before` SMALLINT UNSIGNED DEFAULT 15,
  `pnr` VARCHAR(10) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_journeys_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_journeys_from_stn` FOREIGN KEY (`from_station_code`) REFERENCES `stations` (`code`),
  CONSTRAINT `fk_journeys_to_stn` FOREIGN KEY (`to_station_code`) REFERENCES `stations` (`code`),
  INDEX `idx_journeys_user` (`user_id`),
  INDEX `idx_journeys_date` (`journey_date`),
  INDEX `idx_journeys_tatkal_open` (`tatkal_opening_date`, `tatkal_opening_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. PNR Tracking & Status History
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pnr_tracking` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NULL,
  `pnr_number` VARCHAR(10) NOT NULL,
  `train_number` VARCHAR(10) NOT NULL,
  `train_name` VARCHAR(150) NOT NULL,
  `from_station_code` VARCHAR(10) NOT NULL,
  `to_station_code` VARCHAR(10) NOT NULL,
  `journey_date` DATE NOT NULL,
  `travel_class` VARCHAR(5) NOT NULL,
  `charting_status` ENUM('CHART_NOT_PREPARED', 'CHART_PREPARED') DEFAULT 'CHART_NOT_PREPARED',
  `passenger_status_json` JSON NOT NULL,
  `platform` VARCHAR(10) NULL,
  `delay_minutes` INT DEFAULT 0,
  `last_checked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pnr_number` (`pnr_number`),
  INDEX `idx_pnr_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Alerts & Notifications
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `alerts_notifications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `journey_id` VARCHAR(36) NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('TATKAL_COUNTDOWN', 'DEPARTURE', 'PNR_STATUS', 'SYSTEM') NOT NULL,
  `scheduled_for` TIMESTAMP NOT NULL,
  `status` ENUM('PENDING', 'TRIGGERED', 'DISMISSED') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_alerts_journey` FOREIGN KEY (`journey_id`) REFERENCES `saved_journeys` (`id`) ON DELETE SET NULL,
  INDEX `idx_alerts_scheduled` (`scheduled_for`, `status`),
  INDEX `idx_alerts_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Tatkal Rule Configurations (Admin Controlled)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tatkal_rules_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ac_opening_hour` TINYINT UNSIGNED DEFAULT 10,
  `ac_opening_minute` TINYINT UNSIGNED DEFAULT 0,
  `non_ac_opening_hour` TINYINT UNSIGNED DEFAULT 11,
  `non_ac_opening_minute` TINYINT UNSIGNED DEFAULT 0,
  `advance_days` TINYINT UNSIGNED DEFAULT 1,
  `max_passengers_per_tatkal` TINYINT UNSIGNED DEFAULT 4,
  `tatkal_charges_min_sl` INT DEFAULT 100,
  `tatkal_charges_max_sl` INT DEFAULT 200,
  `tatkal_charges_min_3a` INT DEFAULT 300,
  `tatkal_charges_max_3a` INT DEFAULT 400,
  `tatkal_charges_min_2a` INT DEFAULT 400,
  `tatkal_charges_max_2a` INT DEFAULT 500,
  `senior_citizen_concession_allowed` BOOLEAN DEFAULT FALSE,
  `cancellation_refund_on_confirmed` BOOLEAN DEFAULT FALSE,
  `notes` VARCHAR(500) NULL,
  `updated_by` VARCHAR(36) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Audit Logs & System Health Events
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(80) NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `endpoint` VARCHAR(255) NULL,
  `status_code` SMALLINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `details_json` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_event` (`event_type`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial rules
INSERT INTO `tatkal_rules_config` 
(`ac_opening_hour`, `ac_opening_minute`, `non_ac_opening_hour`, `non_ac_opening_minute`, `advance_days`, `max_passengers_per_tatkal`, `notes`)
VALUES (10, 0, 11, 0, 1, 4, 'Standard Railway Board Tatkal Regulations');
