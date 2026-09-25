package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.IssueCategory;
import com.findmymeds.backend.model.enums.Priority;
import com.findmymeds.backend.model.enums.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateCivilianReportRequest {

    @NotNull(message = "Report type is required")
    private ReportType type;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private IssueCategory category;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Details are required")
    private String details;

    private List<String> attachments;
}
