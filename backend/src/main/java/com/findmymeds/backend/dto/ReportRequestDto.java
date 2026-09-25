package com.findmymeds.backend.dto;

import lombok.Data;

@Data
public class ReportRequestDto {
    private String type;
    private String issueCategory;
    private String priority;
    private String title;
    private String description;
}
