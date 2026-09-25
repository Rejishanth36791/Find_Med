package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.PharmacyAnalyticsDto;
import com.findmymeds.backend.service.PharmacyAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.findmymeds.backend.config.PharmacyUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/pharmacy/data-summary")
@RequiredArgsConstructor
public class PharmacyAnalyticsController {

    // Controller to fetch pharmacy analytics data

    private final PharmacyAnalyticsService analyticsService;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: User is not a pharmacy");
    }

    @GetMapping
    public ResponseEntity<PharmacyAnalyticsDto> getPharmacyAnalytics() {
        return ResponseEntity.ok(analyticsService.getPharmacyAnalytics(getCurrentPharmacyId()));
    }
}
