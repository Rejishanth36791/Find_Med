package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "civilians")
public class Civilian {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "nic_number", unique = true)
    private String nicNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status")
    private AccountStatus accountStatus;

    @Column(name = "temp_ban_count")
    private Integer tempBanCount = 0;

    @Column(name = "appeal_count")
    private Integer appealCount = 0;

    @Column(name = "ban_date")
    private LocalDateTime banDate;

    @Column(name = "permanent_ban_date")
    private LocalDateTime permanentBanDate;

    // Masked Data Fields for VIVO / Privacy
    @Column(name = "masked_email")
    private String maskedEmail;

    @Column(name = "masked_name")
    private String maskedName;

    @Column(name = "is_login_disabled")
    private Boolean isLoginDisabled = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "ban_reason", columnDefinition = "TEXT")
    private String banReason;

    @PreUpdate
    public void setUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
    }
}
