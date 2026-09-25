package com.findmymeds.backend.scheduler;

import com.findmymeds.backend.service.CivilianNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CivilianNotificationCleanupScheduler {

    private final CivilianNotificationService notificationService;

    // Daily cleanup: read notifications older than 15 days
    @Scheduled(cron = "0 0 2 * * *") // 2AM daily
    public void cleanupOldReadNotifications() {
        try {
            log.info("Starting cleanup of old read notifications (older than 15 days)...");
            int deletedCount = notificationService.deleteOldReadNotifications();
            if (deletedCount > 0) {
                log.info("Successfully deleted {} old read notifications.", deletedCount);
            } else {
                log.info("No old read notifications to clean up.");
            }
        } catch (Exception e) {
            log.error("Error during notification cleanup: {}", e.getMessage(), e);
        }
    }
}
