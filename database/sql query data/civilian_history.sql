CREATE TABLE civilian_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    civilian_id BIGINT NOT NULL,
    action_type ENUM('BAN', 'UNBAN', 'WARN', 'PROFILE_UPDATE'),
    action_by BIGINT, -- Admin ID
    reason TEXT,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (civilian_id) REFERENCES civilians(id)
);

-- Insert sample data with correct ENUM values
INSERT INTO civilian_history
    (civilian_id, action_type, action_by, reason, timestamp)
VALUES
    (3, 'BAN', 1, 'Temporary ban due to offensive content.', '2026-02-02 09:20:00'),
    (5, 'BAN', 2, 'Permanent ban for repeated violations.', '2026-02-05 10:10:00'),
    (7, 'WARN', 3, 'Warning for inappropriate messages.', '2026-02-03 08:50:00'),
    (10, 'PROFILE_UPDATE', 1, 'Updated email and contact number.', '2026-02-05 14:15:00'),
    (12, 'UNBAN', 2, 'Temporary ban issued by mistake.', '2026-02-06 09:05:00'),
    (15, 'BAN', 3, 'Temporary ban for spam.', '2026-02-04 11:40:00'),
    (20, 'BAN', 1, 'Permanent ban for multiple violations.', '2026-02-06 13:05:00'),
    (22, 'UNBAN', 2, 'Ban lifted after appeal approval.', '2026-02-08 10:10:00'),
    (25, 'BAN', 3, 'Permanent ban for harassment.', '2026-02-08 08:40:00'),
    (27, 'UNBAN', 1, 'Temporary ban removed.', '2026-02-08 13:35:00'),
    -- Continue in the same pattern for remaining rows
    (30, 'BAN', 2, 'Permanent ban issued for abusive behavior.', '2026-02-09 14:20:00'),
    (32, 'UNBAN', 3, 'Temporary ban lifted after appeal.', '2026-02-11 10:35:00'),
    (35, 'BAN', 1, 'Permanent ban for repeated offenses.', '2026-02-11 11:15:00'),
    (37, 'UNBAN', 2, 'Temporary ban removed.', '2026-02-13 09:05:00'),
    (40, 'BAN', 3, 'Permanent ban due to policy violation.', '2026-02-13 14:50:00'),
    (42, 'UNBAN', 1, 'Ban lifted after successful appeal.', '2026-02-15 10:10:00'),
    (45, 'BAN', 2, 'Permanent ban for multiple infractions.', '2026-02-15 12:05:00'),
    (47, 'UNBAN', 3, 'Temporary ban removed.', '2026-02-17 09:35:00'),
    (50, 'BAN', 1, 'Permanent ban issued.', '2026-02-17 15:15:00');
