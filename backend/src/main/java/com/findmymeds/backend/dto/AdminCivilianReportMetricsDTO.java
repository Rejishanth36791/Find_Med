package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminCivilianReportMetricsDTO {
    private long total;
    private long pending;
    private long inProgress;
    private long resolved;
    private long rejected;
}
