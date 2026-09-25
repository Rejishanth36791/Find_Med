package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.AppealStatus;
import com.findmymeds.backend.model.enums.BanType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminAppealDetailsDTO {

    // Appeal info
    private Long appealId;
    private BanType banType;
    private Integer appealNumber;
    private String appealReason;
    private String attachment;
    private AppealStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    // Civilian summary
    private Long civilianId;
    private String civilianName;
    private String civilianEmail;
    private String civilianPhone;
    private String nicNumber;

    private Integer tempBanCount;
    private Integer appealCount;
    private Integer remainingAppeals; // MAX_APPEALS - appealCount
    private String accountStatus;

    private Long totalReservations;
    private Long uncollectedOrders;

    // History timeline
    private List<AdminAppealHistoryItemDTO> history;
}
