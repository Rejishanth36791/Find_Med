package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Admin;

import com.findmymeds.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")

@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<Admin> getProfile() {
        // Mock: Try to find ID 1, otherwise return the first available admin for demo
        // purposes
        return adminService.getAdminEntityById(1L)
                .or(() -> adminService.getAllAdminEntities().stream().findFirst())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
