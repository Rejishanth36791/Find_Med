package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminNotificationResponseDTO;
import com.findmymeds.backend.service.AdminNotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

    private final AdminNotificationService adminNotificationService;

    public AdminNotificationController(AdminNotificationService adminNotificationService) {
        this.adminNotificationService = adminNotificationService;
    }

    // View more notifications (paginated)
    @GetMapping
    public Page<AdminNotificationResponseDTO> getAdminNotifications(Pageable pageable) {
        return adminNotificationService.getAdminNotifications(pageable);
    }
}
