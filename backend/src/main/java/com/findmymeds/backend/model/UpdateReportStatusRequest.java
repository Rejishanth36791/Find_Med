package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateReportStatusRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;

    private String notes;
}