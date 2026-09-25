package com.findmymeds.backend.scheduler;

import com.findmymeds.backend.model.CivilianReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.repository.CivilianReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CivilianReportCleanupScheduler {

    private final CivilianReportRepository reportRepository;

    // Daily cleanup: resolved/rejected reports older than 60 days
    @Scheduled(cron = "0 0 3 * * *") // 3AM daily
    @Transactional
    public void cleanupOldReports() {

        LocalDateTime cutoff = LocalDateTime.now().minusDays(60);

        List<CivilianReport> oldReports =
                reportRepository.findByStatusInAndStatusChangedAtBefore(
                        List.of(ReportStatus.RESOLVED, ReportStatus.REJECTED),
                        cutoff
                );

        if (oldReports.isEmpty()) {
            log.info("No old civilian reports to clean up.");
            return;
        }

        reportRepository.deleteAll(oldReports);

        log.info("Deleted {} old civilian reports (resolved/rejected > 60 days).",
                oldReports.size());
    }
}
