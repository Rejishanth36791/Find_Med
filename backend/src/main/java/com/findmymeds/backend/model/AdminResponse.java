package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}