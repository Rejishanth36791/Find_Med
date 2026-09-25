package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.CivilianActionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "civilian_history")
public class CivilianHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "civilian_id", nullable = false)
    private Civilian civilian;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private CivilianActionType actionType;

    @Column(name = "action_by")
    private Long actionBy; // Admin ID

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
