package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.PharmacyProfile;
import com.findmymeds.backend.service.AdminPharmacyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin/pharmacy-profiles")
public class AdminPharmacyProfileController {

    @Autowired
    private AdminPharmacyProfileService profileService;

    @GetMapping("/{pharmacyId}")
    public Optional<PharmacyProfile> getProfileByPharmacy(@PathVariable Long pharmacyId) {
        return profileService.getProfileByPharmacyId(pharmacyId);
    }

    @PostMapping
    public PharmacyProfile saveProfile(@RequestBody @org.springframework.lang.NonNull PharmacyProfile profile) {
        return profileService.saveProfile(profile);
    }
}
