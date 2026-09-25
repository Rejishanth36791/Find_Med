package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medicine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;
    private String genericName;
    private String activeIngredients; // Comma separated or tags

    @Enumerated(EnumType.STRING)
    private MedicineType type;

    private String manufacturer;
    private String countryOfManufacture;
    private String registrationNumber;
    private String imageUrl;
    private String dosageForm;
    private String strength;
    private String storageInstructions;
    private String notes;
    private String description;

    // New fields for Drug Dictionary
    private String usageInstructions; // Replacing 'usage' to be more descriptive, but mapped to 'usage' in DTO if
                                      // needed
    private String precautions;
    private String sideEffects;

    // Keeping existing field just in case, though logically price is common
    private Double price;
    private boolean requiresPrescription;

    @Enumerated(EnumType.STRING)
    private MedicineStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    private boolean removed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;

    public enum MedicineType {
        TABLET, CAPSULE, SYRUP, INJECTION, OINTMENT, CREAM, DROPS, INHALER, OTHER, SUSPENSION, CREAM_OINTMENT
    }

    public enum MedicineStatus {
        ACTIVE, INACTIVE, OUT_OF_STOCK, DISCONTINUED
    }

    public enum ApprovalStatus {
        APPROVED, PENDING, REJECTED
    }
}
