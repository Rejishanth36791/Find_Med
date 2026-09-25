package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "admin_activity_logs")
public class AdminActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId;

    @Column(nullable = false)
    private String action;

    @Column(name = "target_admin_id")
    private Long targetAdminId;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
