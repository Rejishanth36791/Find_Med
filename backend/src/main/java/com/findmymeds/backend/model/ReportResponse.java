package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.Priority; // FIX 1: Import the correct Enum
import com.findmymeds.backend.model.enums.ReportCategory;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private Long adminId;
    private String adminName;
    private ReportType type;
    private String title;
    private ReportCategory category;

    private Priority priority;

    private String details;

    private List<String> attachments;

    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}