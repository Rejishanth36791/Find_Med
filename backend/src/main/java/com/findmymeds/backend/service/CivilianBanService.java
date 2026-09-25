package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.enums.AccountStatus;
import com.findmymeds.backend.model.enums.CivilianActionType;
import com.findmymeds.backend.repository.CivilianRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CivilianBanService {

    private final CivilianRepository civilianRepository;
    private final CivilianHistoryLogger historyLogger;

    @Transactional
    public void tempBan(Long civilianId, String reason, Long adminId) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));

        int tempBans = nz(c.getTempBanCount());

        // No TEMP ban #3 -> auto PERMANENT
        if (tempBans >= CivilianRules.MAX_TEMP_BANS) {
            permanentBanInternal(c, "Auto permanent ban: temp ban limit exceeded. " + safe(reason), adminId);
            return;
        }

        c.setAccountStatus(AccountStatus.TEMP_BANNED);
        c.setTempBanCount(tempBans + 1);
        c.setBanReason(reason);
        c.setBanDate(LocalDateTime.now());

        civilianRepository.save(c);
        historyLogger.log(c, CivilianActionType.TEMP_BAN, adminId, reason);
    }

    @Transactional
    public void permanentBan(Long civilianId, String reason, Long adminId) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));
        permanentBanInternal(c, reason, adminId);
    }

    private void permanentBanInternal(Civilian c, String reason, Long adminId) {
        c.setAccountStatus(AccountStatus.PERMANENT_BANNED);
        c.setPermanentBanDate(LocalDateTime.now());
        c.setBanReason(reason);
        c.setIsLoginDisabled(true);

        civilianRepository.save(c);
        historyLogger.log(c, CivilianActionType.PERM_BAN, adminId, reason);
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
