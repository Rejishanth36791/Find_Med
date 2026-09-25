package com.findmymeds.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PharmacyProfileDto {
    private Long id;
    private String name;
    private String address;
    private String licenseNumber;
    private String registrationNo;
    private String ownerName;
    private String nic;
    private String contactNumber;
    private String email;
    private String operatingHours;
    private LocalDateTime registeredDate;
    private String licenseStatus;
    private String district;
    private Double rating;
    private String licenseDocument;
    private Boolean verified;
    private String logoPath;
}
