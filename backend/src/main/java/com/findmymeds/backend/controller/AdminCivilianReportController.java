package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.AdminCivilianReportDetailsDTO;
import com.findmymeds.backend.dto.AdminCivilianReportMetricsDTO;
import com.findmymeds.backend.dto.AdminCivilianReportRejectDTO;
import com.findmymeds.backend.dto.AdminCivilianReportRespondDTO;
import com.findmymeds.backend.dto.AdminCivilianReportRowDTO;
import com.findmymeds.backend.model.enums.ReportStatus;
import com.findmymeds.backend.model.enums.ReportType;
import com.findmymeds.backend.service.CivilianReportAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/civilian-reports")
@RequiredArgsConstructor
public class AdminCivilianReportController {

    private final CivilianReportAdminService reportService;

    @GetMapping("/metrics")
    public AdminCivilianReportMetricsDTO metrics() {
        return reportService.getMetrics();
    }

    @GetMapping
    public Page<AdminCivilianReportRowDTO> list(
            @RequestParam(required = false) ReportType type,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reportService.list(type, status, search, pageable);
    }

    @GetMapping("/{id}")
    public AdminCivilianReportDetailsDTO details(@PathVariable Long id) {
        return reportService.getDetails(id);
    }

    @PostMapping("/{id}/in-progress")
    public void inProgress(@PathVariable Long id) {
        reportService.markInProgress(id);
    }

    @PostMapping("/{id}/resolve")
    public void resolve(@PathVariable Long id) {
        reportService.resolve(id);
    }

    @PostMapping("/{id}/reject")
    public void reject(@PathVariable Long id, @RequestBody(required = false) AdminCivilianReportRejectDTO req) {
        // If you want to store reason later, we can add a message table.
        reportService.reject(id);
    }

    @PostMapping("/{id}/respond")
    public void respond(@PathVariable Long id, @RequestBody AdminCivilianReportRespondDTO req) {
        reportService.respond(id, req.getMessage(), req.getAttachmentPath());
    }
}
