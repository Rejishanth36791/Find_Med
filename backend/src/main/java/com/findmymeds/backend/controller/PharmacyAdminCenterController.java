package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.PharmacyProfileDto;
import com.findmymeds.backend.dto.PharmacyReportDTO;
import com.findmymeds.backend.dto.ReportRequestDto;
import com.findmymeds.backend.service.PharmacyAdminCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.findmymeds.backend.repository.PharmacyRepository;
import com.findmymeds.backend.model.Pharmacy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyAdminCenterController {

    private final PharmacyAdminCenterService pharmacyAdminCenterService;
    private final PharmacyRepository pharmacyRepository;

    @GetMapping("/center/profile")
    @SuppressWarnings("null")
    public ResponseEntity<PharmacyProfileDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Pharmacy pharmacy = pharmacyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in pharmacy not found"));

        return ResponseEntity
                .ok(pharmacyAdminCenterService.getProfile(pharmacy.getId()));
    }

    @PostMapping("/reports")
    public ResponseEntity<Void> submitReport(@RequestBody ReportRequestDto report) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Pharmacy pharmacy = pharmacyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in pharmacy not found"));

        pharmacyAdminCenterService.submitReport(pharmacy.getId(), report);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports/history")
    public ResponseEntity<List<PharmacyReportDTO>> getReportHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Pharmacy pharmacy = pharmacyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in pharmacy not found"));

        return ResponseEntity.ok(pharmacyAdminCenterService.getReportHistory(pharmacy.getId()));
    }
}
