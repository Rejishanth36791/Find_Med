package com.findmymeds.backend.scheduler;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.enums.AccountStatus;
import com.findmymeds.backend.model.enums.CivilianActionType;
import com.findmymeds.backend.repository.CivilianAppealRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import com.findmymeds.backend.service.CivilianArchiveService;
import com.findmymeds.backend.service.CivilianHistoryLogger;
import com.findmymeds.backend.service.CivilianRules;
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
public class CivilianEnforcementScheduler {

    private final CivilianRepository civilianRepository;
    private final CivilianAppealRepository appealRepository;
    private final CivilianHistoryLogger historyLogger;
    private final CivilianArchiveService archiveService;

    // Daily: appeal window expiry -> auto permanent ban (ONLY if no appeal submitted)
    @Scheduled(cron = "0 0 2 * * *") // 2AM daily
    @Transactional
    public void autoPermanentBanExpiredTempBans() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(CivilianRules.APPEAL_WINDOW_DAYS);
        List<Civilian> expired = civilianRepository.findTempBannedBefore(AccountStatus.TEMP_BANNED, cutoff);

        int bannedCount = 0;

        for (Civilian c : expired) {
            if (c.getBanDate() != null) {
                boolean hasAppealAfterBan =
                        appealRepository.existsByCivilianIdAndCreatedAtAfter(c.getId(), c.getBanDate());
                if (hasAppealAfterBan) continue;
            }

            c.setAccountStatus(AccountStatus.PERMANENT_BANNED);
            c.setPermanentBanDate(LocalDateTime.now());
            c.setIsLoginDisabled(true);
            c.setBanReason("Auto permanent ban: no appeal within 14 days");
            civilianRepository.save(c);

            historyLogger.log(c, CivilianActionType.AUTO_PERMANENT_BAN, null,
                    "Expired 14-day appeal window (no appeal submitted)");

            bannedCount++;
        }

        log.info("Auto-permanent-banned {} civilians due to expired appeal window.", bannedCount);
    }

    // Daily: permanent ban older than 90 days -> archive + sanitize
    @Scheduled(cron = "0 30 2 * * *") // 2:30AM daily
    @Transactional
    public void autoArchiveAndSanitizePermanentBannedAfter90Days() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(CivilianRules.AUTO_DELETE_DAYS);
        List<Civilian> old = civilianRepository.findPermanentBannedBefore(AccountStatus.PERMANENT_BANNED, cutoff);

        int processed = 0;

        for (Civilian c : old) {
            boolean done = archiveService.archiveAndSanitize(c);
            if (done) processed++;
        }

        log.info("Archived + sanitized {} permanent-banned civilians for 90-day cleanup.", processed);
    }
}
