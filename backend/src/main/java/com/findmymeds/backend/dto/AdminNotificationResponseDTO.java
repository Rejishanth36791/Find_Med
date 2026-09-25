package com.findmymeds.backend.dto;

import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminNotificationResponseDTO {
    private Long id;
    private String title;
    private String message;
    private NotificationType notificationType;
    private Priority priority;
    private boolean read;
    private LocalDateTime createdAt;
}
