CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    contact_number VARCHAR(255),
    profile_picture_url VARCHAR(255),
    role ENUM('ADMIN', 'SUPER_ADMIN'),
    password_hash VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- Insert initial admin accounts
INSERT INTO admins
    (full_name, email, contact_number, profile_picture_url, role, password_hash, status, created_at, updated_at)
VALUES
    ('System Super Admin', 'superadmin@findmymeds.lk', '+94771234567', 'profiles/superadmin.png', 'SUPER_ADMIN', '$2a$10$superadminhashedpasswordexample', 'ACTIVE', '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
    ('Main Administrator', 'admin@findmymeds.lk', '+94779876543', 'profiles/admin.png', 'ADMIN', '$2a$10$adminhashedpasswordexample', 'ACTIVE', '2026-01-02 10:00:00', '2026-01-02 10:00:00');
