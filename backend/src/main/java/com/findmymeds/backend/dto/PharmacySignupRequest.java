package com.findmymeds.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacySignupRequest {
    private String name;
    private String email;
    private String password;
    private String licenseNumber;
    private String phone;
    private String address;
    private String district;
    private String ownerName;
}
