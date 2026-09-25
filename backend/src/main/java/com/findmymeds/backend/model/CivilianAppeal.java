package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.AppealStatus;
import com.findmymeds.backend.model.enums.BanType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "civilian_appeals")
public class CivilianAppeal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "civilian_id")
    private Civilian civilian;

    @Enumerated(EnumType.STRING)
    @Column(name = "ban_type")
    private BanType banType;

    @Column(name = "appeal_number")
    private Integer appealNumber;

    @Column(name = "appeal_reason", columnDefinition = "TEXT")
    private String appealReason;

    private String attachment;

    @Enumerated(EnumType.STRING)
    private AppealStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
