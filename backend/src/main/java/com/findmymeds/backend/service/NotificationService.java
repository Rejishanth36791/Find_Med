package com.findmymeds.backend.service;

import com.findmymeds.backend.model.enums.NotificationType;
import com.findmymeds.backend.model.enums.Role;
import com.findmymeds.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.findmymeds.backend.model.Notification;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public Notification createNotification(Role role, NotificationType type, String title, String message,
            Long entityId) {
        Notification n = new Notification();
        n.setTargetRole(role);
        n.setNotificationType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setRelatedEntityId(entityId);
        return repository.save(n);
    }

    public List<Notification> getNotifications(Role role) {
        return repository.findByTargetRoleOrderByCreatedAtDesc(role);
    }

    public Notification getNotification(long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public void markAsRead(long id) {
        Notification n = repository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getRead()) {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
            repository.save(n);
        }
    }

    public Map<String, Object> getMetrics(Role role) {
        List<Notification> all = repository.findByTargetRoleOrderByCreatedAtDesc(role);
        Map<String, Object> metrics = new HashMap<>();

        metrics.put("total", all.size());
        metrics.put("unread", all.stream().filter(n -> !n.getRead()).count());
        metrics.put("read", all.stream().filter(Notification::getRead).count());
        metrics.put("pharmacy", all.stream().filter(n -> n.getNotificationType() == NotificationType.PHARMACY).count());
        metrics.put("admin", all.stream().filter(n -> n.getNotificationType() == NotificationType.ADMIN).count());
        metrics.put("civilian", all.stream().filter(n -> n.getNotificationType() == NotificationType.CIVILIAN).count());
        metrics.put("system", all.stream().filter(n -> n.getNotificationType() == NotificationType.SYSTEM).count());

        return metrics;
    }

    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    @Transactional
    public void cleanOldReadNotifications() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        repository.deleteOldReadNotifications(cutoff);
    }
}
