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
public class CivilianAppealAdminService {

    private final CivilianAppealRepository appealRepository;
    private final CivilianRepository civilianRepository;
    private final CivilianHistoryLogger historyLogger;
    private final com.findmymeds.backend.service.CivilianBanService banService;

    @Transactional
    public void approve(Long appealId, Long adminId) {
        if (appealId == null) {
            throw new IllegalArgumentException("Appeal ID cannot be null");
        }
        CivilianAppeal appeal = appealRepository.findById(appealId)
                .orElseThrow(() -> new IllegalArgumentException("Appeal not found: " + appealId));

        Civilian c = appeal.getCivilian();

        // If appeal count exceeded -> auto permanent ban
        if (nz(c.getAppealCount()) > CivilianRules.MAX_APPEALS) {
            banService.permanentBan(c.getId(), "Auto permanent ban: appeal limit exceeded", adminId);
            appeal.setStatus(AppealStatus.REJECTED);
            appeal.setResolvedAt(LocalDateTime.now());
            appealRepository.save(appeal);
            return;
        }

        c.setAccountStatus(AccountStatus.ACTIVE);
        civilianRepository.save(c);

        appeal.setStatus(AppealStatus.APPROVED);
        appeal.setResolvedAt(LocalDateTime.now());
        appealRepository.save(appeal);

        historyLogger.log(c, CivilianActionType.APPEAL_APPROVED, adminId, "Appeal approved: " + appealId);
    }

    @Transactional
    public void reject(Long appealId, Long adminId, String reason) {
        if (appealId == null) {
            throw new IllegalArgumentException("Appeal ID cannot be null");
        }
        CivilianAppeal appeal = appealRepository.findById(appealId)
                .orElseThrow(() -> new IllegalArgumentException("Appeal not found: " + appealId));

        appeal.setStatus(AppealStatus.REJECTED);
        appeal.setResolvedAt(LocalDateTime.now());
        appealRepository.save(appeal);

        // Reject => immediate permanent ban
        banService.permanentBan(appeal.getCivilian().getId(),
                "Appeal rejected: " + safe(reason), adminId);

        historyLogger.log(appeal.getCivilian(), CivilianActionType.APPEAL_REJECTED, adminId, reason);
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
