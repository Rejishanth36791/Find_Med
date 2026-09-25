package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.AppealStatus;
import com.findmymeds.backend.model.enums.BanType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminVivoAppealDTO {
    private Long appealId;
    private BanType banType;
    private Integer appealNumber;
    private AppealStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
