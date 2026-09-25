package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.AdminCivilianDetailsDTO;
import com.findmymeds.backend.dto.AdminCivilianMetricCardDTO;
import com.findmymeds.backend.dto.AdminCivilianTableRowDTO;
import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.enums.AccountStatus;
import com.findmymeds.backend.repository.CivilianHistoryRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CivilianQueryService {

    private final CivilianRepository civilianRepository;
    private final CivilianHistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public AdminCivilianMetricCardDTO getMetrics() {
        long total = civilianRepository.count();
        long active = civilianRepository.countByAccountStatus(AccountStatus.ACTIVE);
        long temp = civilianRepository.countByAccountStatus(AccountStatus.TEMP_BANNED);
        long perm = civilianRepository.countByAccountStatus(AccountStatus.PERMANENT_BANNED);

        return new AdminCivilianMetricCardDTO(total, active, temp, perm);
    }

    @Transactional(readOnly = true)
    public Page<AdminCivilianTableRowDTO> getTable(AccountStatus status, String search, Pageable pageable) {
        Page<Civilian> page = civilianRepository.search(status, search, pageable);

        return page.map(c -> AdminCivilianTableRowDTO.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .accountStatus(c.getAccountStatus())
                .tempBanCount(nz(c.getTempBanCount()))
                .appealCount(nz(c.getAppealCount()))
                .lastActionDate(historyRepository.findTopByCivilianIdOrderByTimestampDesc(c.getId())
                        .map(h -> h.getTimestamp())
                        .orElse(c.getUpdatedAt() != null ? c.getUpdatedAt() : c.getCreatedAt()))
                .build());
    }

    @Transactional(readOnly = true)
    public AdminCivilianDetailsDTO getDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Civilian c = civilianRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + id));

        LocalDateTime deadline = null;
        Long remainingDays = null;

        if (c.getAccountStatus() == AccountStatus.TEMP_BANNED && c.getBanDate() != null) {
            deadline = c.getBanDate().plusDays(CivilianRules.APPEAL_WINDOW_DAYS);
            remainingDays = Duration.between(LocalDateTime.now(), deadline).toDays();
        }

        return AdminCivilianDetailsDTO.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .nicNumber(c.getNicNumber())
                .email(c.getEmail())
                .phone(c.getPhone())
                .accountStatus(c.getAccountStatus())
                .tempBanCount(nz(c.getTempBanCount()))
                .appealCount(nz(c.getAppealCount()))
                .banReason(c.getBanReason())
                .banDate(c.getBanDate())
                .appealDeadline(deadline)
                .remainingDays(remainingDays)
                .permanentBanDate(c.getPermanentBanDate())
                .isLoginDisabled(Boolean.TRUE.equals(c.getIsLoginDisabled()))
                .maskedEmail(c.getMaskedEmail())
                .maskedName(c.getMaskedName())
                .build();
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }
}
