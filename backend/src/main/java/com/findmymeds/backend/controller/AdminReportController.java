package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.CreateReportRequest;
import com.findmymeds.backend.model.ReportMetricsResponse;
import com.findmymeds.backend.model.ReportResponse;
import com.findmymeds.backend.model.UpdateReportStatusRequest;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.service.AdminReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-reports")
@RequiredArgsConstructor
public class AdminReportController {

    private final AdminReportService reportService;

    // Get all reports (Super Admin only)
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Get reports by status (Super Admin only)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(
            @PathVariable ReportStatus status) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status));
    }

    // Get my reports (Regular Admin)
    @GetMapping("/my-reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getMyReports(Authentication authentication) {
        Long adminId = getCurrentAdminId(authentication);
        return ResponseEntity.ok(reportService.getReportsByAdmin(adminId));
    }

    // Get report by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    // Get metrics (Super Admin only)
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ReportMetricsResponse> getMetrics() {
        return ResponseEntity.ok(reportService.getMetrics());
    }

    // Create report/inquiry (Regular Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request,
            Authentication authentication) {

        Long adminId = getCurrentAdminId(authentication);
        ReportResponse response = reportService.createReport(request, adminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Update report status (Super Admin only)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportStatusRequest request) {

        ReportResponse response = reportService.updateReportStatus(id, request);
        return ResponseEntity.ok(response);
    }

    private Long getCurrentAdminId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}