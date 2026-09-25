package com.findmymeds.backend.model;

import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.UserType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean read = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role")
    private com.findmymeds.backend.model.enums.Role targetRole;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private com.findmymeds.backend.model.enums.Priority priority;

    @Column(name = "read_at")
    private LocalDateTime readAt;
}
