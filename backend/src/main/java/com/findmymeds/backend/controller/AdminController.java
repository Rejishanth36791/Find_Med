package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminProfileDTO;
import com.findmymeds.backend.model.*;
import com.findmymeds.backend.model.enums.AdminStatus; // <--- Added this import
import com.findmymeds.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AdminResponse>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable @org.springframework.lang.NonNull Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AdminMetricsResponse> getMetrics() {
        return ResponseEntity.ok(adminService.getMetrics());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> createAdmin(
            @Valid @RequestBody CreateAdminRequest request,
            Authentication authentication) {
        try {
            System.out.println("DEBUG: createAdmin called by " + authentication.getName());
            String currentAdminEmail = authentication.getName();
            AdminResponse response = adminService.createAdmin(request, currentAdminEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in createAdmin: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PatchMapping("/{id}/email")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> updateAdminEmail(
            @PathVariable @org.springframework.lang.NonNull Long id,
            @Valid @RequestBody UpdateAdminEmailRequest request,
            Authentication authentication) {

        String currentAdminEmail = authentication.getName();
        AdminResponse response = adminService.updateAdminEmail(id, request, currentAdminEmail);
        return ResponseEntity.ok(response);
    }

    // --- NEW ENDPOINT: Handles Activate / Deactivate ---
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateAdminStatus(
            @PathVariable @org.springframework.lang.NonNull Long id,
            @RequestParam AdminStatus status) {

        adminService.updateAdminStatus(id, status);
        return ResponseEntity.ok().build();
    }
    // ---------------------------------------------------

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(
            @PathVariable @org.springframework.lang.NonNull Long id,
            Authentication authentication) {

        String currentAdminEmail = authentication.getName();
        adminService.deleteAdmin(id, currentAdminEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public AdminProfileDTO getMyProfile() {
        return adminService.getCurrentAdminProfile();
    }
}