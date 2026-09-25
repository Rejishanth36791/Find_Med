package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminCivilianMetricCardDTO {
    private long totalCivilians;
    private long activeCivilians;
    private long tempBannedCivilians;
    private long permanentBannedCivilians;
}
