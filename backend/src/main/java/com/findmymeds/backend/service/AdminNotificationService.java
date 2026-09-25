package com.findmymeds.backend.service;

import com.findmymeds.backend.dto.AdminNotificationResponseDTO;
import com.findmymeds.backend.model.Notification;
import com.findmymeds.backend.model.enums.Role;
import com.findmymeds.backend.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminNotificationService {

    private final NotificationRepository notificationRepository;

    public AdminNotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Page<AdminNotificationResponseDTO> getAdminNotifications(Pageable pageable) {
        Page<Notification> page =
                notificationRepository.findByTargetRoleOrderByCreatedAtDesc(Role.ADMIN, pageable);

        return page.map(n -> new AdminNotificationResponseDTO(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getNotificationType(),
                n.getPriority(),
                Boolean.TRUE.equals(n.getRead()),
                n.getCreatedAt()
        ));
    }
}
