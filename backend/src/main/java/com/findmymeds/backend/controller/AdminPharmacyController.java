package com.findmymeds.backend.controller;

import com.findmymeds.backend.model.Pharmacy;
import com.findmymeds.backend.model.enums.PharmacyStatus;
import com.findmymeds.backend.model.enums.PharmacyType;
import com.findmymeds.backend.service.AdminPharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin/pharmacies")

public class AdminPharmacyController {

    @Autowired
    private AdminPharmacyService pharmacyService;

    // 🔹 TABLE PAGE – list all pharmacies
    @GetMapping
    public List<Pharmacy> getAllPharmacies(
            @RequestParam(required = false) PharmacyStatus status,
            @RequestParam(required = false) PharmacyType type) {
        return pharmacyService.getPharmacies(status, type);
    }

    // 🔹 DETAILS PAGE – get single pharmacy
    @GetMapping("/{id}")
    public Pharmacy getPharmacyById(@PathVariable Long id) {
        return pharmacyService.getPharmacyById(id);
    }

    // 🔹 REJECTED DETAILS PAGE – get rejected pharmacy
    @GetMapping("/rejected/{id}")
    public Pharmacy getRejectedPharmacyById(@PathVariable Long id) {
        return pharmacyService.getRejectedPharmacyById(id);
    }

    // 🔹 CREATE PHARMACY (pharmacyType REQUIRED)
    @PostMapping
    public Pharmacy createPharmacy(@RequestBody Pharmacy pharmacy) {
        return pharmacyService.createPharmacy(pharmacy);
    }

    // 🔹 UPDATE PHARMACY DETAILS (name, type, address, etc.)
    @PutMapping("/{id}")
    public Pharmacy updatePharmacy(
            @PathVariable Long id,
            @RequestBody Pharmacy updatedPharmacy) {
        return pharmacyService.updatePharmacyDetails(id, updatedPharmacy);
    }

    // 🔹 ACTIVE → SUSPENDED
    @PatchMapping("/{id}/suspend")
    public Pharmacy suspendPharmacy(@PathVariable Long id) {
        return pharmacyService.updatePharmacyStatus(id, PharmacyStatus.SUSPENDED);
    }

    // 🔹 SUSPENDED → ACTIVE
    @PatchMapping("/{id}/activate")
    public Pharmacy activatePharmacy(@PathVariable Long id) {
        return pharmacyService.updatePharmacyStatus(id, PharmacyStatus.ACTIVE);
    }

    // 🔹 PENDING → APPROVED (Sent to Super Admin)
    @PatchMapping("/{id}/approve")
    public Pharmacy approvePharmacy(@PathVariable Long id) {
        return pharmacyService.updatePharmacyStatus(id, PharmacyStatus.APPROVED);
    }

    // 🔹 ANY → REMOVED
    @PatchMapping("/{id}/remove")
    public Pharmacy removePharmacy(@PathVariable Long id) {
        return pharmacyService.updatePharmacyStatus(id, PharmacyStatus.REMOVED);
    }

    // 🔹 ANY → REJECTED
    @PatchMapping("/{id}/reject")
    public Pharmacy rejectPharmacy(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        return pharmacyService.updatePharmacyStatus(id, PharmacyStatus.REJECTED);
    }
}
