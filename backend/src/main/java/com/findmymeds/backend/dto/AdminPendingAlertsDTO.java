package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminPendingAlertsDTO {
    private long totalAlerts;
    private long pendingAppeals;
    private long pendingPharmacyApprovals;
    private long unreadNotifications;
}
