CREATE TABLE admin_actions_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action_type VARCHAR(255) NOT NULL,
    target_table VARCHAR(255) NOT NULL,
    target_id BIGINT,
    description TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Insert sample data without specifying 'id'
INSERT INTO admin_actions_log 
    (admin_id, action_type, target_table, target_id, description, created_at) 
VALUES
    (1, 'CREATE', 'admins', 2, 'Created new admin account.', '2026-01-02 10:00:00'),
    (2, 'UPDATE', 'civilians', 5, 'Updated civilian account status.', '2026-01-07 10:15:00'),
    (1, 'APPROVE', 'pharmacy', 3, 'Approved pharmacy registration.', '2026-01-08 11:00:00'),
    (2, 'RESOLVE', 'civilian_reports_inquiries', 4, 'Resolved complaint.', '2026-01-09 12:00:00'),
    (1, 'UPDATE', 'rules_regulations', 2, 'Updated pharmacy guidelines.', '2026-01-10 09:30:00'),
    (2, 'BAN', 'civilians', 7, 'Temporary ban issued.', '2026-01-12 10:20:00'),
    (1, 'SUSPEND', 'pharmacy', 6, 'Pharmacy suspended due to violations.', '2026-01-13 14:00:00'),
    (2, 'UPDATE', 'medicine', 10, 'Medicine marked as inactive.', '2026-01-14 15:30:00'),
    (1, 'CREATE', 'rules_regulations', 15, 'New system compliance rule added.', '2026-01-15 09:00:00'),
    (2, 'REVIEW', 'civilian_appeals', 3, 'Reviewed appeal submission.', '2026-01-16 11:45:00'),
    (1, 'UPDATE', 'admins', 2, 'Updated admin role permissions.', '2026-01-17 10:00:00'),
    (2, 'RESPOND', 'civilian_reports_inquiries', 8, 'Responded to complaint.', '2026-01-18 12:00:00'),
    (1, 'ENABLE', 'system_settings', NULL, 'Enabled maintenance mode.', '2026-01-19 22:00:00'),
    (2, 'VIEW', 'dashboard', NULL, 'Viewed analytics dashboard.', '2026-01-20 09:00:00'),
    (1, 'BACKUP', 'database', NULL, 'Manual backup initiated.', '2026-01-21 01:00:00'),
    (2, 'UNBAN', 'civilians', 7, 'Removed temporary ban.', '2026-01-22 10:00:00'),
    (1, 'DELETE', 'rules_regulations', 16, 'Removed inactive rule.', '2026-01-23 11:00:00'),
    (2, 'UPDATE', 'pharmacy_inventory', 14, 'Updated stock quantity.', '2026-01-24 12:00:00'),
    (1, 'RESET_PASSWORD', 'admins', 2, 'Reset admin password.', '2026-01-25 13:00:00'),
    (2, 'APPROVE', 'medicine', 20, 'Approved medicine listing.', '2026-01-26 14:00:00');
