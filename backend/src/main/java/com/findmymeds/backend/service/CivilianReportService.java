package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.CivilianReport;
import com.findmymeds.backend.model.CreateCivilianReportRequest;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.repository.CivilianReportRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CivilianReportService {

    private final CivilianReportRepository reportRepository;
    private final CivilianRepository civilianRepository;

    @Transactional
    public CivilianReport createReport(CreateCivilianReportRequest request) {
        // Get current user email from security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Civilian civilian = civilianRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Civilian not found"));

        CivilianReport report = new CivilianReport();
        report.setCivilian(civilian);
        report.setType(request.getType());
        report.setIssueCategory(request.getCategory());
        report.setPriority(request.getPriority());
        report.setTitle(request.getTitle());
        report.setDescription(request.getDetails());

        // Handle attachments (assuming list in request but single string in entity for
        // now, or comma separated)
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            report.setAttachmentPath(String.join(",", request.getAttachments()));
        }

        report.setReferenceCode("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());
        report.setStatusChangedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }
}
