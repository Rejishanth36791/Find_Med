package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.Priority;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private Priority priority;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private Long relatedEntityId;
}
