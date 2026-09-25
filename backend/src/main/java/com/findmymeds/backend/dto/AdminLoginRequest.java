package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Request DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginRequest {
    private String email;
    private String password;
}
