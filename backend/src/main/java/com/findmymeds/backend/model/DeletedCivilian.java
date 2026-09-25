package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "deleted_civilians")
public class DeletedCivilian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_civilian_id")
    private Long originalCivilianId;

    @Column(name = "masked_name")
    private String maskedName;

    @Column(name = "masked_email")
    private String maskedEmail;

    @Column(name = "masked_nic")
    private String maskedNic;

    @Column(name = "history_log", columnDefinition = "TEXT")
    private String historyLog;

    @Column(name = "deletion_date")
    private LocalDateTime deletionDate = LocalDateTime.now();
}
