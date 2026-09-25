package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pharmacy_system_settings")
public class PharmacySystemSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pharmacy_id")
    private Pharmacy pharmacy;

    private boolean notificationsEnabled = true;
    private boolean inventoryAlerts = true;
    private boolean expiryAlerts = true;
    private boolean systemMessages = true;

    private String theme = "Light";
    private String defaultHomepage = "Dashboard";
}
