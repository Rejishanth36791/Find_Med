package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.CivilianNotification;
import com.findmymeds.backend.model.enums.CivilianNotificationType;
import com.findmymeds.backend.service.CivilianNotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class CivilianNotificationController {
    private final CivilianNotificationService service;

    public CivilianNotificationController(CivilianNotificationService service) {
        this.service = service;
    }

    // GET /api/notification?userId=1
    @GetMapping
    public List<CivilianNotification> getAll(
            @RequestParam @org.springframework.lang.NonNull Integer userId) {
        return service.getAll(userId);
    }

    // GET /api/notification/type
    @GetMapping("/type")
    public List<CivilianNotification> getByType(
            @RequestParam @org.springframework.lang.NonNull Integer userId,
            @RequestParam CivilianNotificationType type) {
        return service.getByType(userId, type);
    }

    // GET /api/notification/read-status
    @GetMapping("/read-status")
    public List<CivilianNotification> getByReadStatus(
            @RequestParam @org.springframework.lang.NonNull Integer userId,
            @RequestParam Boolean isRead) {
        return service.getByReadStatus(userId, isRead);
    }

    // GET /api/notification/{id}
    @GetMapping("/{id}")
    public CivilianNotification getOne(
            @PathVariable @org.springframework.lang.NonNull Integer id,
            @RequestParam @org.springframework.lang.NonNull Integer userId) {
        return service.getOne(id, userId);
    }

    // PUT /api/notification/{id}/read
    @PutMapping("/{id}/read")
    public void markAsRead(
            @PathVariable @org.springframework.lang.NonNull Integer id,
            @RequestParam @org.springframework.lang.NonNull Integer userId) {
        service.markAsRead(id, userId);
    }

}
