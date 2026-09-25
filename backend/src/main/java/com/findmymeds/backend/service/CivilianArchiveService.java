package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.CivilianHistory;
import com.findmymeds.backend.model.DeletedCivilian;
import com.findmymeds.backend.model.enums.CivilianActionType;
import com.findmymeds.backend.repository.CivilianHistoryRepository;
import com.findmymeds.backend.repository.CivilianRepository;
import com.findmymeds.backend.repository.DeletedCivilianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CivilianArchiveService {

    private final CivilianRepository civilianRepository;
    private final CivilianHistoryRepository historyRepository;
    private final DeletedCivilianRepository deletedRepository;
    private final CivilianHistoryLogger historyLogger;

    @Transactional
    public boolean archiveAndSanitize(Civilian c) {

        // Idempotent: if already archived, don't do again
        if (deletedRepository.existsByOriginalCivilianId(c.getId())) {
            return false;
        }

        // Build history text (last 50)
        List<CivilianHistory> history = historyRepository
                .findTop50ByCivilianIdOrderByTimestampDesc(c.getId());

        String historyLog = history.stream()
                .map(h -> String.format("%s | by=%s | %s | %s",
                        safe(h.getActionType() == null ? "" : h.getActionType().name()),
                        h.getActionBy() == null ? "-" : String.valueOf(h.getActionBy()),
                        safe(h.getReason()),
                        String.valueOf(h.getTimestamp())))
                .reduce("", (a, b) -> a.isEmpty() ? b : a + "\n" + b);


        // Archive minimal snapshot
        DeletedCivilian d = new DeletedCivilian();
        d.setOriginalCivilianId(c.getId());
        d.setMaskedName(nvl(c.getMaskedName(), maskName(c.getFullName())));
        d.setMaskedEmail(nvl(c.getMaskedEmail(), maskEmail(c.getEmail())));
        d.setMaskedNic(maskNic(c.getNicNumber()));
        d.setHistoryLog(historyLog);
        d.setDeletionDate(LocalDateTime.now());
        deletedRepository.save(d);

        // Sanitize original row (DON'T DELETE due to FK refs like reservations)
        c.setPasswordHash(null);
        c.setIsLoginDisabled(true);

        // keep unique constraints valid
        c.setFullName("Deleted Civilian " + c.getId());
        c.setEmail("deleted+" + c.getId() + "@findmymeds.local");
        c.setNicNumber("DEL" + c.getId());
        c.setPhone(null);

        // keep masked fields for admin viewing
        c.setMaskedName(d.getMaskedName());
        c.setMaskedEmail(d.getMaskedEmail());

        civilianRepository.save(c);

        historyLogger.log(c, CivilianActionType.AUTO_DELETE, null,
                "Archived to deleted_civilians and sanitized after 90 days");

        return true;
    }

    private String safe(String s) { return s == null ? "" : s; }
    private String nvl(String a, String b) { return (a == null || a.isBlank()) ? b : a; }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***@***";
        String[] parts = email.split("@", 2);
        String user = parts[0];
        String domain = parts[1];
        String prefix = user.length() <= 2 ? user : user.substring(0, 2);
        return prefix + "***@" + domain;
    }

    private String maskName(String name) {
        if (name == null || name.isBlank()) return "*****";
        String[] parts = name.trim().split("\\s+");
        String first = parts[0];
        return first.charAt(0) + "***" + (parts.length > 1 ? " ***" : "");
    }

    private String maskNic(String nic) {
        if (nic == null || nic.isBlank()) return "***";
        if (nic.length() <= 3) return "***";
        return nic.substring(0, 3) + "******";
    }
}
