package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.PharmacyReport;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.service.AdminPharmacyReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admin/pharmacy-reports")

public class AdminPharmacyReportController {

    @Autowired
    private AdminPharmacyReportService reportService;

    @GetMapping("/status/{status}")
    public List<PharmacyReport> getReportsByStatus(@PathVariable String status) {
        return reportService.getReportsByStatus(parseStatus(status));
    }

    @GetMapping("/pharmacy/{pharmacyId}")
    public List<PharmacyReport> getReportsByPharmacy(@PathVariable @NonNull Long pharmacyId) {
        return reportService.getReportsByPharmacy(pharmacyId);
    }

    @PostMapping
    public PharmacyReport createReport(@RequestBody @NonNull PharmacyReport report) {
        return reportService.saveReport(report);
    }

    @PatchMapping("/{reportId}/status")
    public PharmacyReport updateReportStatus(@PathVariable @NonNull Long reportId,
            @RequestParam String status) {
        return reportService.updateReportStatus(reportId, parseStatus(status));
    }

    private ReportStatus parseStatus(String status) {
        if (status == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        String normalized = status.trim().toUpperCase().replace('-', '_');
        try {
            return ReportStatus.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            String message = String.format("Invalid status '%s'. Valid values: %s",
                    status, java.util.Arrays.toString(ReportStatus.values()));
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message, ex);
        }
    }
}
