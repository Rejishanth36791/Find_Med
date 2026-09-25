package com.findmymeds.backend.service;

import com.findmymeds.backend.model.PharmacyReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.repository.AdminPharmacyReportRepository;
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
public class PharmacyReportCleanupService {

    private final AdminPharmacyReportRepository reportRepository;

    // Run daily at midnight
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupOldReports() {
        log.info("Starting cleanup of old pharmacy reports/inquiries");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(60);
        List<ReportStatus> finalStatuses = Arrays.asList(
                ReportStatus.RESOLVED,
                ReportStatus.REJECTED);

        List<PharmacyReport> oldReports = reportRepository
                .findByStatusInAndStatusChangedAtBefore(finalStatuses, cutoffDate);

        if (!oldReports.isEmpty()) {
            reportRepository.deleteAll(oldReports);
            log.info("Deleted {} old pharmacy reports/inquiries", oldReports.size());
        } else {
            log.info("No old pharmacy reports to delete");
        }
    }
}
