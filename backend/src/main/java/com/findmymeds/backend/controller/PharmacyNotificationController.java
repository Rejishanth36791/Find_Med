package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.NotificationCategoryCountDTO;
import com.findmymeds.backend.dto.NotificationDTO;
import com.findmymeds.backend.service.PharmacyNotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/notifications")

@lombok.RequiredArgsConstructor
public class PharmacyNotificationController {

    private final PharmacyNotificationService notificationService;

    @GetMapping("/categories")
    public ResponseEntity<List<NotificationCategoryCountDTO>> getCategoryCounts() {
        return ResponseEntity.ok(notificationService.getCategoryCounts());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getTotalUnreadCount());
    }

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(notificationService.getNotifications(page, size));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotification(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        notificationService.deleteAllNotifications();
        return ResponseEntity.ok().build();
    }
}
