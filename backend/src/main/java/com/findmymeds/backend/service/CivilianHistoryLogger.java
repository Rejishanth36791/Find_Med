package com.findmymeds.backend.service;

import com.findmymeds.backend.model.Civilian;
import com.findmymeds.backend.model.CivilianHistory;
import com.findmymeds.backend.model.enums.CivilianActionType;
import com.findmymeds.backend.repository.CivilianHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CivilianHistoryLogger {

    private final CivilianHistoryRepository historyRepository;

    public void log(Civilian civilian, CivilianActionType actionType, Long adminId, String reason) {
        CivilianHistory history = new CivilianHistory();
        history.setCivilian(civilian);
        history.setActionType(actionType);
        history.setActionBy(adminId);
        history.setReason(reason);

        historyRepository.save(history);
    }
}
