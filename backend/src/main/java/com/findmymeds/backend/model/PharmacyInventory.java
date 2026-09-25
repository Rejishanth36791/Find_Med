package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pharmacy_inventory")
public class PharmacyInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private Pharmacy pharmacy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "expiry_date")
    private java.time.LocalDate expiryDate;

    @Column(name = "batch_number")
    private String batchNumber;

    @PrePersist
    public void onCreate() {
        this.lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
