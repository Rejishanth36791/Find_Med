package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pharmacy_activity_logs")
public class PharmacyActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Pharmacy pharmacy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    @Column(nullable = false)
    private String action;

    private String detail;

    private String link; // Optional link to navigate to

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
