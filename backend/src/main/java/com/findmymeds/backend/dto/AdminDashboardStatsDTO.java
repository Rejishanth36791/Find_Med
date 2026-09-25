package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardStatsDTO {

    private long totalCivilians;
    private long activeCivilians;
    private long temporaryBannedCivilians;
    private long permanentBannedCivilians;
}
