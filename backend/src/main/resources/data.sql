-- Admin Seeding (Update password if exists)
INSERT INTO admins (full_name, email, contact_number, role, password_hash, status, created_at, updated_at)
VALUES ('Super Admin', 'admin@findmymeds.com', '0771234567', 'SUPER_ADMIN', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG';

-- Pharmacy Seeding (Update password if exists)
INSERT INTO pharmacy (pharmacy_name, license_number, owner_name, email, password_hash, phone, status, created_at, address, district, pharmacy_type)
VALUES ('City Care Pharmacy', 'PH-1001', 'John Pharmacist', 'citycare@findmymeds.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '0112345678', 'APPROVED', NOW(), '123 Main St, Colombo', 'Colombo', 'RETAIL')
ON DUPLICATE KEY UPDATE password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', status='APPROVED';

-- Ensure Pharmacy Profile Exists
INSERT INTO pharmacy_profiles (pharmacy_id, created_at)
SELECT p.id, NOW()
FROM pharmacy p
WHERE p.license_number = 'PH-1001'
AND NOT EXISTS (SELECT 1 FROM pharmacy_profiles pp WHERE pp.pharmacy_id = p.id);

-- Civilian Seeding (Update password if exists)
INSERT INTO civilians (full_name, nic_number, email, phone, password_hash, account_status, created_at, updated_at)
VALUES ('John Doe', '200012345678', 'user@findmymeds.com', '0701234567', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG';

-- Ensure Civilian Profile Exists
INSERT INTO civilian_profiles (civilian_id, created_at, date_of_birth, gender, address)
SELECT c.id, NOW(), '1995-05-15', 'MALE', '45 Park Road, Colombo 07'
FROM civilians c
WHERE c.email = 'user@findmymeds.com'
AND NOT EXISTS (SELECT 1 FROM civilian_profiles cp WHERE cp.civilian_id = c.id);
