package com.findmymeds.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PharmacyReportDTO {
    private Long id;
    private String type;
    private String category;
    private String priority;
    private String status;
    private LocalDateTime date;
    private String title;
}
