package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;
import com.findmymeds.backend.model.enums.IssueCategory;
import com.findmymeds.backend.model.enums.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCivilianReportRowDTO {
    private Long id;
    private String referenceCode;

    private ReportType type;
    private ReportStatus status;
    private IssueCategory issueCategory;
    private Priority priority;

    private String title;

    private Long civilianId;
    private String civilianName;

    private LocalDateTime createdAt;
    private LocalDateTime statusChangedAt;
}
