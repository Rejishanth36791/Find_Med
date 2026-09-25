package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.PharmacyStatus;
import com.findmymeds.backend.model.enums.PharmacyType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pharmacy_name")
    private String name;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "registration_no")
    private String registrationNo;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "nic")
    private String nic;

    @Column(name = "district")
    private String district;

    @Column(name = "address")
    private String address;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar(20)")
    private PharmacyStatus status;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "reviews")
    private Integer reviews;

    @Column(name = "badge")
    private String badge;

    @Enumerated(EnumType.STRING)
    @Column(name = "pharmacy_type", nullable = false)
    private PharmacyType pharmacyType;

    @Transient
    private Double distance;
    // Optional, for UI purposes

}
