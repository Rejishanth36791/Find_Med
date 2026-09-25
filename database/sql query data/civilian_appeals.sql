CREATE TABLE civilian_appeals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    civilian_id BIGINT,
    ban_type ENUM('TEMP', 'PERMANENT'),
    appeal_number INT,
    appeal_reason TEXT,
    attachment VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    created_at DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (civilian_id) REFERENCES civilians(id)
);

-- Insert sample data
INSERT INTO civilian_appeals
    (civilian_id, ban_type, appeal_number, appeal_reason, attachment, status, created_at, resolved_at)
VALUES
    (3, 'TEMP', 1, 'I believe my temporary ban was a mistake.', 'appeal_doc_3_1.pdf', 'PENDING', '2026-02-02 09:30:00', NULL),
    (5, 'PERMANENT', 1, 'Requesting reconsideration of permanent ban.', 'appeal_doc_5_1.pdf', 'REJECTED', '2026-02-05 10:00:00', '2026-02-06 11:00:00'),
    (7, 'TEMP', 1, 'I apologize and request ban removal.', NULL, 'APPROVED', '2026-02-03 08:15:00', '2026-02-04 09:00:00'),
    (10, 'PERMANENT', 1, 'I was banned unfairly, please review.', 'appeal_doc_10_1.pdf', 'PENDING', '2026-02-05 14:20:00', NULL),
    (12, 'TEMP', 1, 'Ban was issued mistakenly.', NULL, 'APPROVED', '2026-02-06 09:00:00', '2026-02-07 10:30:00'),
    (15, 'TEMP', 1, 'I did not violate any rules.', 'appeal_doc_15_1.pdf', 'REJECTED', '2026-02-04 11:45:00', '2026-02-05 12:00:00'),
    (20, 'PERMANENT', 1, 'Requesting second review of permanent ban.', NULL, 'PENDING', '2026-02-06 13:00:00', NULL),
    (22, 'TEMP', 1, 'I apologize for my actions, requesting ban lift.', 'appeal_doc_22_1.pdf', 'APPROVED', '2026-02-07 09:15:00', '2026-02-08 10:00:00'),
    (25, 'PERMANENT', 1, 'Please reconsider my ban, I will follow rules.', NULL, 'REJECTED', '2026-02-08 08:30:00', '2026-02-09 09:45:00'),
    (27, 'TEMP', 1, 'I was banned mistakenly.', 'appeal_doc_27_1.pdf', 'APPROVED', '2026-02-07 12:00:00', '2026-02-08 13:30:00'),
    -- Continue for remaining rows with proper TEMP/PERMANENT or NULL for ban_type
    (30, 'PERMANENT', 1, 'Permanent ban seems unjustified.', NULL, 'PENDING', '2026-02-09 14:10:00', NULL),
    (32, 'TEMP', 1, 'Request to lift temporary ban.', 'appeal_doc_32_1.pdf', 'APPROVED', '2026-02-10 09:45:00', '2026-02-11 10:30:00');
