package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.IssueCategory;
import com.findmymeds.backend.model.enums.Priority;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "civilian_reports_inquiries")
public class CivilianReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code")
    private String referenceCode;

    @ManyToOne
    @JoinColumn(name = "civilian_id")
    private Civilian civilian;

    @Enumerated(EnumType.STRING)
    private ReportType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_category")
    private IssueCategory issueCategory;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "attachment_path")
    private String attachmentPath;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status_changed_at")
    private LocalDateTime statusChangedAt;

    @Column(columnDefinition = "TEXT", name = "admin_response")
    private String adminResponse;

    @Column(name = "admin_response_attachment")
    private String adminResponseAttachment;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
}
