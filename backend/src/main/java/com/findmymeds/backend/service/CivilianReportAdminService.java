package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.AdminCivilianReportDetailsDTO;
import com.findmymeds.backend.dto.AdminCivilianReportMetricsDTO;
import com.findmymeds.backend.dto.AdminCivilianReportRowDTO;
import com.findmymeds.backend.model.CivilianReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;

import com.findmymeds.backend.repository.CivilianReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CivilianReportAdminService {

    private final CivilianReportRepository reportRepository;

    @Transactional(readOnly = true)
    public AdminCivilianReportMetricsDTO getMetrics() {
        long total = reportRepository.count();
        long pending = reportRepository.countByStatus(ReportStatus.PENDING);
        long inProgress = reportRepository.countByStatus(ReportStatus.IN_PROGRESS);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long rejected = reportRepository.countByStatus(ReportStatus.REJECTED);

        return new AdminCivilianReportMetricsDTO(total, pending, inProgress, resolved, rejected);
    }

    @Transactional(readOnly = true)
    public Page<AdminCivilianReportRowDTO> list(ReportType type, ReportStatus status, String search,
            Pageable pageable) {
        return reportRepository.search(type, status, search, pageable)
                .map(r -> AdminCivilianReportRowDTO.builder()
                        .id(r.getId())
                        .referenceCode(r.getReferenceCode())
                        .type(r.getType())
                        .status(r.getStatus())
                        .issueCategory(r.getIssueCategory())
                        .priority(r.getPriority())
                        .title(r.getTitle())
                        .civilianId(r.getCivilian() != null ? r.getCivilian().getId() : null)
                        .civilianName(r.getCivilian() != null ? r.getCivilian().getFullName() : null)
                        .createdAt(r.getCreatedAt())
                        .statusChangedAt(r.getStatusChangedAt())
                        .build());
    }

    @Transactional(readOnly = true)
    public AdminCivilianReportDetailsDTO getDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        CivilianReport r = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + id));

        return AdminCivilianReportDetailsDTO.builder()
                .id(r.getId())
                .referenceCode(r.getReferenceCode())
                .type(r.getType())
                .status(r.getStatus())
                .issueCategory(r.getIssueCategory())
                .priority(r.getPriority())
                .title(r.getTitle())
                .description(r.getDescription())
                .attachmentPath(r.getAttachmentPath())
                .civilianId(r.getCivilian() != null ? r.getCivilian().getId() : null)
                .civilianName(r.getCivilian() != null ? r.getCivilian().getFullName() : null)
                .civilianEmail(r.getCivilian() != null ? r.getCivilian().getEmail() : null)
                .createdAt(r.getCreatedAt())
                .statusChangedAt(r.getStatusChangedAt())
                .build();
    }

    @Transactional
    public void markInProgress(Long id) {
        CivilianReport r = getEntity(id);
        r.setStatus(ReportStatus.IN_PROGRESS);
        r.setStatusChangedAt(LocalDateTime.now());
        reportRepository.save(r);
    }

    @Transactional
    public void resolve(Long id) {
        CivilianReport r = getEntity(id);
        r.setStatus(ReportStatus.RESOLVED);
        r.setStatusChangedAt(LocalDateTime.now());
        r.setResolvedAt(LocalDateTime.now());
        reportRepository.save(r);
    }

    @Transactional
    public void reject(Long id) {
        CivilianReport r = getEntity(id);
        r.setStatus(ReportStatus.REJECTED);
        r.setStatusChangedAt(LocalDateTime.now());
        r.setRejectedAt(LocalDateTime.now());
        reportRepository.save(r);
    }

    // For now this just changes statusChangedAt; later we can store admin replies
    // in a message table
    @Transactional
    public void respond(Long id, String message, String attachmentPath) {
        CivilianReport r = getEntity(id);
        r.setAdminResponse(message);
        r.setAdminResponseAttachment(attachmentPath);
        r.setStatusChangedAt(LocalDateTime.now());
        reportRepository.save(r);
    }

    private CivilianReport getEntity(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + id));
    }
}
