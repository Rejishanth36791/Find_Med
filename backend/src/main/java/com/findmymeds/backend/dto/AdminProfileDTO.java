package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminProfileDTO {
    private String name;
    private Role role;
}
