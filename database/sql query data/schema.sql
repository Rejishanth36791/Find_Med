-- Database Schema for FindMyMeds

-- CIVILIAN TABLES

CREATE TABLE civilians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    nic_number VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    password_hash VARCHAR(255),
    account_status ENUM('ACTIVE', 'TEMP_BANNED', 'PERMANENT_BANNED'),
    temp_ban_count INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE civilian_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    civilian_id BIGINT,
    address TEXT,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    created_at DATETIME,
    FOREIGN KEY (civilian_id) REFERENCES civilians(id)
);

CREATE TABLE pharmacy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_name VARCHAR(255),
    license_number VARCHAR(255) UNIQUE,
    owner_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address TEXT,
    latitude DOUBLE,
    longitude DOUBLE,
    operating_hours VARCHAR(255),
        status VARCHAR(20),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME
);

CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_code VARCHAR(255) UNIQUE,
    civilian_id BIGINT,
    pharmacy_id BIGINT,
    status ENUM('PENDING', 'CONFIRMED', 'READY', 'COLLECTED', 'CANCELLED'),
    pickup_date DATE,
    prescription_file VARCHAR(255),
    notes TEXT,
    total_amount DECIMAL(10, 2),
    created_at DATETIME,
    status_changed_at DATETIME,
    FOREIGN KEY (civilian_id) REFERENCES civilians(id),
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id)
);

CREATE TABLE medicine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255),
    generic_name VARCHAR(255),
    active_ingredients TEXT,
    type ENUM('TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'OINTMENT', 'CREAM', 'DROPS', 'INHALER', 'OTHER', 'SUSPENSION', 'CREAM_OINTMENT'),
    manufacturer VARCHAR(255),
    country_of_manufacture VARCHAR(255),
    registration_number VARCHAR(255),
    image_url VARCHAR(255),
    dosage_form VARCHAR(255),
    strength VARCHAR(255),
    storage_instructions TEXT,
    notes TEXT,
    description TEXT,
    price DOUBLE,
    requires_prescription BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'),
    approval_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING',
    removed BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    last_updated DATETIME
);

CREATE TABLE reservation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT,
    medicine_id BIGINT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    FOREIGN KEY (medicine_id) REFERENCES medicine(id)
);

CREATE TABLE pharmacy_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id BIGINT,
    medicine_id BIGINT,
    available_quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    batch_number VARCHAR(255),
    expiry_date DATE,
    last_updated DATETIME,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id),
    FOREIGN KEY (medicine_id) REFERENCES medicine(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('CIVILIAN', 'PHARMACY', 'ADMIN'),
    user_id BIGINT,
    notification_type ENUM('RESERVATION', 'APPEAL', 'REPORT', 'ACCOUNT', 'SYSTEM', 'PHARMACY', 'MEDICINE', 'ADMIN', 'CIVILIAN'),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    target_role ENUM('ADMIN', 'SUPER_ADMIN'),
    related_entity_id BIGINT,
    priority ENUM('CRITICAL', 'WARNING', 'INFO'),
    read_at DATETIME,
    created_at DATETIME
);

-- SAMPLE DATA

INSERT INTO pharmacy (id, pharmacy_name, license_number, owner_name, email, phone, address, status, created_at)
VALUES (1, 'City Health Pharmacy', 'PH-12345', 'John Doe', 'city.health@example.com', '011-2345678', '123 Main St, Colombo', 'ACTIVE', NOW());

INSERT INTO medicine (id, medicine_name, generic_name, manufacturer, dosage_form, strength, requires_prescription, status, approval_status, created_at)
VALUES 
(1, 'Paracetamol', 'Acetaminophen', 'GSK', 'Tablet', '500mg', FALSE, 'ACTIVE', 'APPROVED', NOW()),
(2, 'Amoxicillin', 'Amoxicillin', 'AstraZeneca', 'Capsule', '250mg', TRUE, 'ACTIVE', 'APPROVED', NOW()),
(3, 'Insulin', 'Insulin Glargine', 'Sanofi', 'Injection', '100 units/ml', TRUE, 'ACTIVE', 'APPROVED', NOW());

INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, available_quantity, price, batch_number, expiry_date, last_updated)
VALUES 
(1, 1, 150, 5.00, 'B123', '2026-12-31', NOW()),
(1, 2, 8, 25.00, 'B456', '2025-06-30', NOW()),
(1, 3, 0, 1500.00, 'B789', '2025-01-01', NOW());

INSERT INTO notifications (user_type, user_id, notification_type, title, message, is_read, priority, created_at)
VALUES 
('PHARMACY', 1, 'MEDICINE', 'Low Stock Alert', 'Medicine Amoxicillin is running low (8 left).', FALSE, 'WARNING', NOW()),
('PHARMACY', 1, 'MEDICINE', 'Out of Stock Alert', 'Medicine Insulin is out of stock!', FALSE, 'CRITICAL', NOW()),
('PHARMACY', 1, 'SYSTEM', 'Welcome', 'Welcome to the FindMyMeds Pharmacy Panel.', TRUE, 'INFO', DATE_SUB(NOW(), INTERVAL 1 DAY));

