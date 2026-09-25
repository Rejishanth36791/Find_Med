package com.findmymeds.backend.controller;

import com.findmymeds.backend.dto.PharmacyProfileDto;
import com.findmymeds.backend.service.PharmacyProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.findmymeds.backend.config.PharmacyUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/pharmacy/profile")
@RequiredArgsConstructor
public class PharmacyProfileController {

    private final PharmacyProfileService pharmacyProfileService;

    private Long getCurrentPharmacyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PharmacyUserDetails) {
            return ((PharmacyUserDetails) auth.getPrincipal()).getPharmacy().getId();
        }
        throw new RuntimeException("Unauthorized: User is not a pharmacy");
    }

    @GetMapping
    public ResponseEntity<PharmacyProfileDto> getProfile() {
        return ResponseEntity.ok(pharmacyProfileService.getProfile(getCurrentPharmacyId()));
    }

    @PutMapping
    public ResponseEntity<Void> updateProfile(@RequestBody PharmacyProfileDto dto) {
        pharmacyProfileService.updateProfile(getCurrentPharmacyId(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/upload-logo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<java.util.Map<String, String>> uploadLogo(
            @RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
        String logoUrl = pharmacyProfileService.uploadLogo(getCurrentPharmacyId(), file);
        return ResponseEntity.ok(java.util.Collections.singletonMap("logoUrl", logoUrl));
    }
}
