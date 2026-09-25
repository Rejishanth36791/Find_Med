CREATE TABLE admin_reports_inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submitted_by_admin_id BIGINT NOT NULL,
    type ENUM('SYSTEM', 'USER', 'PHARMACY', 'OTHER') NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') DEFAULT 'PENDING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    category ENUM('TECHNICAL', 'ACCOUNT', 'INQUIRY', 'OTHER') NOT NULL,
    attachments TEXT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    internal_notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    resolved_at DATETIME,
    rejected_at DATETIME
);

-- Insert sample data
INSERT INTO admin_reports_inquiries
    (submitted_by_admin_id, type, status, priority, category, attachments, title, description, internal_notes, created_at, updated_at, resolved_at, rejected_at)
VALUES
    (2, 'SYSTEM', 'RESOLVED', 'HIGH', 'TECHNICAL', NULL, 'Server Downtime Issue', 'Server was unreachable.', 'Restart fixed issue.', '2026-01-05 09:00:00', '2026-01-05 10:00:00', '2026-01-05 10:00:00', NULL),
    (2, 'USER', 'IN_PROGRESS', 'MEDIUM', 'ACCOUNT', NULL, 'Multiple Login Failures', 'User reported login issue.', NULL, '2026-01-06 09:00:00', NULL, NULL, NULL),
    (1, 'PHARMACY', 'RESOLVED', 'HIGH', 'INQUIRY', NULL, 'Pharmacy Approval Delay', 'Approval backlog noticed.', 'Cleared backlog.', '2026-01-07 10:00:00', '2026-01-07 12:00:00', '2026-01-07 12:00:00', NULL),
    (2, 'OTHER', 'REJECTED', 'LOW', 'OTHER', NULL, 'Minor UI Suggestion', 'Color change suggestion.', 'Not required.', '2026-01-08 11:00:00', '2026-01-08 12:00:00', NULL, '2026-01-08 12:00:00'),
    (1, 'SYSTEM', 'PENDING', 'CRITICAL', 'TECHNICAL', NULL, 'Database Backup Failure', 'Night backup failed.', NULL, '2026-01-09 01:00:00', NULL, NULL, NULL),
    (2, 'USER', 'RESOLVED', 'MEDIUM', 'INQUIRY', NULL, 'Appeal Review Process', 'Clarification needed.', 'Updated process.', '2026-01-10 09:00:00', '2026-01-10 10:00:00', '2026-01-10 10:00:00', NULL),
    (1, 'SYSTEM', 'IN_PROGRESS', 'HIGH', 'TECHNICAL', NULL, 'Inventory Sync Issue', 'Inventory not syncing.', NULL, '2026-01-11 09:00:00', NULL, NULL, NULL),
    (2, 'SYSTEM', 'RESOLVED', 'HIGH', 'TECHNICAL', NULL, 'Notification Delay', 'Notifications delayed.', 'Queue optimized.', '2026-01-12 09:00:00', '2026-01-12 10:00:00', '2026-01-12 10:00:00', NULL),
    (1, 'OTHER', 'PENDING', 'LOW', 'OTHER', NULL, 'Feature Suggestion', 'Add dark mode toggle.', NULL, '2026-01-13 09:00:00', NULL, NULL, NULL),
    (2, 'USER', 'RESOLVED', 'MEDIUM', 'ACCOUNT', NULL, 'Account Reactivation', 'User requested reactivation.', 'Reactivated successfully.', '2026-01-14 09:00:00', '2026-01-14 10:00:00', '2026-01-14 10:00:00', NULL);
