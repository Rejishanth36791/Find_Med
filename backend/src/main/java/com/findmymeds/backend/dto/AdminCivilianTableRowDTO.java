package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.AccountStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCivilianTableRowDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;

    private AccountStatus accountStatus;

    private Integer tempBanCount;
    private Integer appealCount;

    private LocalDateTime lastActionDate;
}
