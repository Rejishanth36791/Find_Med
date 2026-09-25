package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.CivilianActionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminAppealHistoryItemDTO {

    private CivilianActionType actionType;
    private Long actionBy;
    private String reason;
    private LocalDateTime timestamp;
}
