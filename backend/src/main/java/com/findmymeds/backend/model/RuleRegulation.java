package com.findmymeds.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rules_regulations")
public class RuleRegulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
