package com.findmymeds.backend.service;

import com.findmymeds.backend.model.AdminReportInquiry;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.repository.AdminReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportCleanupService {

    private final AdminReportRepository reportRepository;
    private final com.findmymeds.backend.repository.CivilianReportRepository civilianReportRepository;

    // Run daily at midnight
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupOldReports() {
        log.info("Starting cleanup of old resolved/rejected reports");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(60);
        List<ReportStatus> finalStatuses = Arrays.asList(
                ReportStatus.RESOLVED,
                ReportStatus.REJECTED);

        List<AdminReportInquiry> oldReports = reportRepository
                .findByStatusInAndUpdatedAtBefore(finalStatuses, cutoffDate);

        if (!oldReports.isEmpty()) {
            reportRepository.deleteAll(oldReports);
            log.info("Deleted {} old reports/inquiries", oldReports.size());
        } else {
            log.info("No old reports to delete");
        }

        // Cleanup Civilian Reports
        List<com.findmymeds.backend.model.CivilianReport> oldCivilianReports = civilianReportRepository
                .findByStatusInAndStatusChangedAtBefore(finalStatuses, cutoffDate);

        if (!oldCivilianReports.isEmpty()) {
            civilianReportRepository.deleteAll(oldCivilianReports);
            log.info("Deleted {} old civilian reports/inquiries", oldCivilianReports.size());
        }
    }
}