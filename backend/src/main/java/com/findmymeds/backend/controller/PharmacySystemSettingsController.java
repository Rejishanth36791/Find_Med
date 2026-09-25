package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.SystemSettingsDto;
import com.findmymeds.backend.service.PharmacySystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.findmymeds.backend.config.PharmacyUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/pharmacy/settings")
@RequiredArgsConstructor
public class PharmacySystemSettingsController {

    private final PharmacySystemSettingsService pharmacySystemSettingsService;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: User is not a pharmacy");
    }

    @GetMapping
    public ResponseEntity<SystemSettingsDto> getSettings() {
        return ResponseEntity.ok(pharmacySystemSettingsService.getSettings(getCurrentPharmacyId()));
    }

    @PutMapping
    public ResponseEntity<Void> saveSettings(@RequestBody SystemSettingsDto settings) {
        pharmacySystemSettingsService.saveSettings(getCurrentPharmacyId(), settings);
        return ResponseEntity.ok().build();
    }
}
