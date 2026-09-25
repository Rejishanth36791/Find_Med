package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.AccountStatus;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCivilianDetailsDTO {

    private Long id;
    private String fullName;
    private String nicNumber;
    private String email;
    private String phone;

    private AccountStatus accountStatus;
    private Integer tempBanCount;
    private Integer appealCount;

    private String banReason;
    private LocalDateTime banDate;

    // Calculated by backend (banDate + 14 days)
    private LocalDateTime appealDeadline;
    private Long remainingDays;

    private LocalDateTime permanentBanDate;

    // VIVO/privacy fields
    private Boolean isLoginDisabled;
    private String maskedEmail;
    private String maskedName;
}
