package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CivilianDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private com.findmymeds.backend.model.enums.AccountStatus accountStatus;
    private String banReason;
    private java.time.LocalDateTime banDate;
}
