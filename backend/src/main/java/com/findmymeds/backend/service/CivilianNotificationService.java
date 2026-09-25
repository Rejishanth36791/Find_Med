package com.findmymeds.backend.service;

import com.findmymeds.backend.model.CivilianNotification;
import com.findmymeds.backend.model.enums.CivilianNotificationType;
import com.findmymeds.backend.repository.CivilianNotificationRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CivilianNotificationService {

    private final CivilianNotificationRepo repository;

    public CivilianNotificationService(CivilianNotificationRepo repository) {
        this.repository = repository;
    }

    // GET all notifications
    public List<CivilianNotification> getAll(Integer userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // GET by type
    public List<CivilianNotification> getByType(
            Integer userId,
            CivilianNotificationType type) {
        return repository.findByUserIdAndType(userId, type);
    }

    // GET by read status
    public List<CivilianNotification> getByReadStatus(
            Integer userId,
            Boolean isRead) {
        return repository.findByUserIdAndIsRead(userId, isRead);
    }

    // GET single notification
    public CivilianNotification getOne(@org.springframework.lang.NonNull Integer id, Integer userId) {
        return repository.findById(id)
                .map(n -> {
                    if (!n.getUserId().equals(userId)) {
                        throw new RuntimeException("Unauthorized access to notification");
                    }
                    return n;
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // MARK AS READ
    public void markAsRead(@org.springframework.lang.NonNull Integer id,
            @org.springframework.lang.NonNull Integer userId) {
        CivilianNotification notification = getOne(id, userId);
        notification.setIsRead(true);
        repository.save(notification);
    }

    // DELETE read notifications older than 15 days
    @Transactional
    public int deleteOldReadNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);
        return repository.deleteReadNotificationsOlderThan(cutoffDate);
    }

}
