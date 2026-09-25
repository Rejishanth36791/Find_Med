package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.CivilianAppeal;
import com.findmymeds.backend.model.enums.*;
import com.findmymeds.backend.repository.CivilianAppealRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CivilianAppealService {

    private final CivilianRepository civilianRepository;
    private final CivilianAppealRepository appealRepository;
    private final CivilianHistoryLogger historyLogger;
    private final CivilianBanService banService;

    @Transactional
    public CivilianAppeal submitAppeal(Long civilianId, String reason, String attachment) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));

        if (c.getAccountStatus() != AccountStatus.TEMP_BANNED) {
            throw new IllegalArgumentException("Appeal allowed only for TEMP_BANNED civilians");
        }

        if (c.getBanDate() == null) {
            throw new IllegalArgumentException("Ban date missing for civilian: " + civilianId);
        }

        // 14-day window check
        LocalDateTime deadline = c.getBanDate().plusDays(CivilianRules.APPEAL_WINDOW_DAYS);
        if (LocalDateTime.now().isAfter(deadline)) {
            // past deadline -> auto permanent ban
            banService.permanentBan(civilianId, "Auto permanent ban: appeal window expired", null);
            throw new IllegalArgumentException("Appeal window expired; account permanently banned");
        }

        int appealCount = c.getAppealCount() == null ? 0 : c.getAppealCount();

        // limit check
        if (appealCount >= CivilianRules.MAX_APPEALS) {
            banService.permanentBan(civilianId, "Auto permanent ban: appeal limit exceeded", null);
            throw new IllegalArgumentException("Appeal limit exceeded; account permanently banned");
        }

        // increment appeal count & create appeal record
        int nextAppealNumber = appealCount + 1;
        c.setAppealCount(nextAppealNumber);
        civilianRepository.save(c);

        CivilianAppeal appeal = new CivilianAppeal();
        appeal.setCivilian(c);
        appeal.setBanType(BanType.TEMPORARY);
        appeal.setAppealNumber(nextAppealNumber);
        appeal.setAppealReason(reason);
        appeal.setAttachment(attachment);
        appeal.setStatus(AppealStatus.PENDING);
        appeal.setCreatedAt(LocalDateTime.now());

        CivilianAppeal saved = appealRepository.save(appeal);

        // We don't have APPEAL_SUBMITTED in your enum (and DB enum column), so we log a
        // safe action:
        historyLogger.log(c, CivilianActionType.VIEW_VIVO, null, "Appeal submitted (recorded in civilian_appeals)");

        return saved;
    }
}
