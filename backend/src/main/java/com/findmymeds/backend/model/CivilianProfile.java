package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "civilian_profiles")
public class CivilianProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "civilian_id", referencedColumnName = "id")
    private Civilian civilian;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
