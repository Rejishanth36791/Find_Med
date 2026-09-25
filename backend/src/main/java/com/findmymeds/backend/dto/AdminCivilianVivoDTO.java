package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.AccountStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminCivilianVivoDTO {

    // Civilian (masked / safe fields)
    private Long civilianId;
    private String maskedName;
    private String maskedEmail;
    private String maskedNic;
    private String maskedPhone;

    private AccountStatus accountStatus;
    private Boolean isLoginDisabled;

    // Ban info
    private String banReason;
    private LocalDateTime banDate;
    private LocalDateTime permanentBanDate;

    private Integer tempBanCount;
    private Integer appealCount;

    // Related history
    private List<AdminVivoReservationDTO> reservations;
    private List<AdminVivoAppealDTO> appeals;
    private List<AdminVivoHistoryDTO> history;
}
