package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.CreateCivilianReportRequest;
import com.findmymeds.backend.service.CivilianReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/civilian/reports")
@RequiredArgsConstructor
public class CivilianReportController {

    private final CivilianReportService reportService;

    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody CreateCivilianReportRequest request) {
        try {
            return ResponseEntity.ok(reportService.createReport(request));
        } catch (Exception e) {
            e.printStackTrace(); // Print to console (hopefully visible)
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage() + " | Cause: "
                    + (e.getCause() != null ? e.getCause().getMessage() : "null"));
        }
    }
}
