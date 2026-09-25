package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "civilian_report_logs")
public class CivilianReportLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private CivilianReport report;

    @Column(name = "action_by_admin_id")
    private Long actionByAdminId;

    @Enumerated(EnumType.STRING)
    private ReportStatus action;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime timestamp = LocalDateTime.now();
}
