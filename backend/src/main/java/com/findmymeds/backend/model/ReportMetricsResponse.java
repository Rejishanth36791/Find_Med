package com.findmymeds.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportMetricsResponse {
    private long totalReports;
    private long pendingReports;
    private long ongoingReports;
    private long resolvedReports;
    private long rejectedReports;
}