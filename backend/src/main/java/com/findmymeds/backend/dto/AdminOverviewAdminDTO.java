package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOverviewAdminDTO {
    private long totalCivilians;
    private long temporaryBans;
    private long pendingCivilianAppeals;
    private long pendingPharmacyRequests;
    private long activePharmacies;
}
