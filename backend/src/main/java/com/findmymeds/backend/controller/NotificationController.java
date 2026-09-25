package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.enums.Role;
import com.findmymeds.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.findmymeds.backend.model.Notification;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")

@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam Role role) {
        return ResponseEntity.ok(service.getNotifications(role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotification(@PathVariable Long id) {
        return ResponseEntity.ok(service.getNotification(id));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(@RequestParam Role role) {
        return ResponseEntity.ok(service.getMetrics(role));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
