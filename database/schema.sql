-- Database Schema untuk Website Donasi
-- Database: donation_website

CREATE DATABASE IF NOT EXISTS donation_website;
USE donation_website;

-- Table: users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255) DEFAULT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) DEFAULT NULL,
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expires DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: campaigns
CREATE TABLE campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    story TEXT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    image_url VARCHAR(255),
    gallery JSON DEFAULT NULL,
    status ENUM('draft', 'pending', 'active', 'completed', 'rejected', 'suspended') DEFAULT 'draft',
    rejection_reason TEXT DEFAULT NULL,
    start_date DATE,
    end_date DATE,
    is_urgent BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    donation_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id)
);

-- Table: donations
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    donor_name VARCHAR(100),
    donor_email VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'expired', 'cancelled') DEFAULT 'pending',
    tripay_reference VARCHAR(100) UNIQUE,
    tripay_merchant_ref VARCHAR(100),
    tripay_payment_url TEXT,
    payment_fee DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    paid_at TIMESTAMP NULL,
    expired_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_tripay_reference (tripay_reference)
);

-- Table: comments
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id)
);

-- Table: campaign_updates
CREATE TABLE campaign_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id)
);

-- Table: withdrawals
CREATE TABLE withdrawals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
    admin_notes TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Table: payment_methods
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category ENUM('virtual_account', 'ewallet', 'retail', 'qris') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    fee_flat DECIMAL(15,2) DEFAULT 0,
    fee_percent DECIMAL(5,2) DEFAULT 0,
    min_amount DECIMAL(15,2) DEFAULT 0,
    max_amount DECIMAL(15,2) DEFAULT NULL,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: admin_logs
CREATE TABLE admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id INT NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Table: site_settings
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Triggers untuk update current_amount di campaigns
DELIMITER $$

CREATE TRIGGER update_campaign_amount_after_donation_insert
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'paid' THEN
        UPDATE campaigns 
        SET 
            current_amount = current_amount + NEW.net_amount,
            donation_count = donation_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.campaign_id;
    END IF;
END$$

CREATE TRIGGER update_campaign_amount_after_donation_update
AFTER UPDATE ON donations
FOR EACH ROW
BEGIN
    -- Jika status berubah dari tidak paid ke paid
    IF OLD.payment_status != 'paid' AND NEW.payment_status = 'paid' THEN
        UPDATE campaigns 
        SET 
            current_amount = current_amount + NEW.net_amount,
            donation_count = donation_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.campaign_id;
    END IF;
    
    -- Jika status berubah dari paid ke tidak paid
    IF OLD.payment_status = 'paid' AND NEW.payment_status != 'paid' THEN
        UPDATE campaigns 
        SET 
            current_amount = current_amount - OLD.net_amount,
            donation_count = donation_count - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.campaign_id;
    END IF;
END$$

DELIMITER ;

-- Indexes untuk performance
CREATE INDEX idx_campaigns_status_created ON campaigns(status, created_at DESC);
CREATE INDEX idx_donations_status_created ON donations(payment_status, created_at DESC);
CREATE INDEX idx_campaigns_search ON campaigns(title, description);
CREATE FULLTEXT INDEX idx_campaigns_fulltext ON campaigns(title, description, story);