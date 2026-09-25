package com.findmymeds.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsResponse {
    private long totalAdmins;
    private long superAdmins;
    private long regularAdmins;
}