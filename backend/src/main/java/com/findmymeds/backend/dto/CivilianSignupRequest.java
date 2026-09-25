package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CivilianSignupRequest {
    private String fullName;
    private String nicNumber;
    private String email;
    private String phone;
    private String password;
}
