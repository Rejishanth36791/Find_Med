package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.*;
import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.CivilianAppeal;
import com.findmymeds.backend.model.CivilianHistory;
import com.findmymeds.backend.model.Reservation;
import com.findmymeds.backend.model.enums.CivilianActionType;
import com.findmymeds.backend.repository.CivilianAppealRepository;
import com.findmymeds.backend.repository.CivilianHistoryRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import com.findmymeds.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CivilianVivoService {

    private final CivilianRepository civilianRepository;
    private final ReservationRepository reservationRepository;
    private final CivilianAppealRepository appealRepository;
    private final CivilianHistoryRepository historyRepository;
    private final CivilianHistoryLogger historyLogger;

    @Transactional(readOnly = true)
    public AdminCivilianVivoDTO getVivo(Long civilianId) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));

        // reservations (limit to latest 50)
        List<AdminVivoReservationDTO> reservations = reservationRepository
                .findByCivilianIdOrderByReservationDateDesc(civilianId)
                .stream()
                .limit(50)
                .map(this::mapReservation)
                .toList();

        // appeals (latest first, limit 20)
        List<AdminVivoAppealDTO> appeals = appealRepository
                .findByCivilianIdOrderByCreatedAtDesc(civilianId)
                .stream()
                .limit(20)
                .map(this::mapAppeal)
                .toList();

        // history (latest first, limit 50)
        List<AdminVivoHistoryDTO> history = historyRepository
                .findTop50ByCivilianIdOrderByTimestampDesc(civilianId)
                .stream()
                .map(this::mapHistory)
                .toList();

        return AdminCivilianVivoDTO.builder()
                .civilianId(c.getId())
                .maskedName(nvl(c.getMaskedName(), maskName(c.getFullName())))
                .maskedEmail(nvl(c.getMaskedEmail(), maskEmail(c.getEmail())))
                .maskedNic(maskNic(c.getNicNumber()))
                .maskedPhone(maskPhone(c.getPhone()))

                .accountStatus(c.getAccountStatus())
                .isLoginDisabled(Boolean.TRUE.equals(c.getIsLoginDisabled()))

                .banReason(c.getBanReason())
                .banDate(c.getBanDate())
                .permanentBanDate(c.getPermanentBanDate())

                .tempBanCount(nz(c.getTempBanCount()))
                .appealCount(nz(c.getAppealCount()))

                .reservations(reservations)
                .appeals(appeals)
                .history(history)
                .build();
    }

    @Transactional
    public void disableLogin(Long civilianId, Long adminId) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));

        c.setIsLoginDisabled(true);
        civilianRepository.save(c);

        historyLogger.log(c, CivilianActionType.LOGIN_DISABLED, adminId, "Login disabled via VIVO");
    }

    /**
     * Anonymize PII fields safely while keeping uniqueness constraints valid.
     * This approach removes real PII but keeps DB consistent.
     */
    @Transactional
    public void anonymize(Long civilianId, Long adminId) {
        if (civilianId == null) {
            throw new IllegalArgumentException("Civilian ID cannot be null");
        }
        Civilian c = civilianRepository.findById(civilianId)
                .orElseThrow(() -> new IllegalArgumentException("Civilian not found: " + civilianId));

        // store masked versions for view
        c.setMaskedName(maskName(c.getFullName()));
        c.setMaskedEmail(maskEmail(c.getEmail()));

        // overwrite PII with anonymized values (unique-safe)
        c.setFullName("Anonymized Civilian " + civilianId);
        c.setEmail("anonymized+" + civilianId + "@findmymeds.local");
        c.setPhone(null);
        c.setNicNumber("ANON" + civilianId);

        civilianRepository.save(c);

        historyLogger.log(c, CivilianActionType.DATA_MASKED, adminId, "PII anonymized via VIVO");
    }

    private AdminVivoReservationDTO mapReservation(Reservation r) {
        Long pharmacyId = null;
        String pharmacyName = null;

        if (r.getPharmacy() != null) {
            pharmacyId = r.getPharmacy().getId();
            pharmacyName = r.getPharmacy().getName();

        }

        return AdminVivoReservationDTO.builder()
                .reservationId(String.valueOf(r.getId()))
                .status(String.valueOf(r.getStatus()))
                .reservationDate(r.getReservationDate())
                .pharmacyId(pharmacyId)
                .pharmacyName(pharmacyName)
                .build();
    }

    private AdminVivoAppealDTO mapAppeal(CivilianAppeal a) {
        return AdminVivoAppealDTO.builder()
                .appealId(a.getId())
                .banType(a.getBanType())
                .appealNumber(a.getAppealNumber())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .resolvedAt(a.getResolvedAt())
                .build();
    }

    private AdminVivoHistoryDTO mapHistory(CivilianHistory h) {
        return AdminVivoHistoryDTO.builder()
                .actionType(h.getActionType())
                .actionBy(h.getActionBy())
                .reason(h.getReason())
                .timestamp(h.getTimestamp())
                .build();
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }

    private String nvl(String a, String b) {
        return (a == null || a.isBlank()) ? b : a;
    }

    // ---- masking helpers (simple + readable) ----
    private String maskEmail(String email) {
        if (email == null || !email.contains("@"))
            return "***@***";
        String[] parts = email.split("@", 2);
        String user = parts[0];
        String domain = parts[1];
        String prefix = user.length() <= 2 ? user : user.substring(0, 2);
        return prefix + "***@" + domain;
    }

    private String maskName(String name) {
        if (name == null || name.isBlank())
            return "*****";
        String[] parts = name.trim().split("\\s+");
        String first = parts[0];
        String firstMasked = first.charAt(0) + "***";
        return firstMasked + (parts.length > 1 ? " ***" : "");
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.isBlank())
            return "***";
        String p = phone.replaceAll("\\s+", "");
        if (p.length() <= 2)
            return "**";
        return "***" + p.substring(p.length() - 2);
    }

    private String maskNic(String nic) {
        if (nic == null || nic.isBlank())
            return "***";
        if (nic.length() <= 3)
            return "***";
        return nic.substring(0, 3) + "******";
    }
}
